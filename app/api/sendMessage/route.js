// MongoDB 연결 추가
import clientPromise from '../../../lib/mongodb'

// 환경 변수에서 API 키 및 Assistant ID 가져오기
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = process.env.ASSISTANT_ID;

// 메타데이터 태그 제거 함수
function cleanAssistantResponse(text) {
    // 【숫자:숫자†source】 형식의 메타데이터 제거
    return text.replace(/【\d+:\d+†source】/g, '');
}

// MongoDB에 채팅 기록 저장 함수 - 데이터베이스 이름 수정
async function saveChatHistory(userMessage, assistantResponse, recommendations = []) {
    try {
        const client = await clientPromise
        const db = client.db("chatbotDB") // ✅ 변경: portfolio_chat → chatbotDB
        const collection = db.collection("messages") // ✅ 이미 맞음
        
        await collection.insertOne({
            userMessage,
            assistantResponse,
            recommendations,
            timestamp: new Date().toISOString()
        })
        
        console.log(`채팅 기록 저장 완료`)
    } catch (error) {
        console.error('채팅 기록 저장 오류:', error)
    }
}

export async function POST(request) {
    try {
        const { message, thread_id } = await request.json();
        console.log(`클라이언트가 보낸 메시지: ${message}`);
        console.log(`스레드 ID: ${thread_id}`);

        let threadId = thread_id;

        // 1. 스레드가 없는 경우 새로운 스레드 생성
        if (!threadId) {
            const threadResponse = await fetch("https://api.openai.com/v1/threads", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                    "OpenAI-Beta": "assistants=v2"
                },
                body: JSON.stringify({})
            });

            const threadData = await threadResponse.json();
            console.log(`스레드 생성 응답: ${JSON.stringify(threadData)}`);
            
            if (threadData.error) {
                return Response.json({
                    error: `스레드 생성 오류: ${threadData.error.message}`
                }, { status: 500 });
            }
                
            threadId = threadData.id;
            if (!threadId) {
                return Response.json({
                    error: "스레드 ID를 찾을 수 없습니다."
                }, { status: 500 });
            }
                
            console.log(`새 스레드 생성: ${threadId}`);
        }

        // 2. 스레드에 메시지 추가
        const messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v2"
            },
            body: JSON.stringify({
                role: "user",
                content: `반드시 다음 JSON 형식으로만 응답하세요. 메타데이터 태그(【...】)나 참조 정보는 포함하지 마세요:

{
  "answer": "여기에 한국어로 깔끔한 답변만 작성하세요",
  "recommendations": [
    "관련 질문 1",
    "관련 질문 2", 
    "관련 질문 3"
  ]
}

사용자 질문: ${message}`
            })
        });

        const messageData = await messageResponse.json();
        console.log(`메시지 추가 응답: ${JSON.stringify(messageData)}`);
        
        if (messageData.error) {
            return Response.json({
                error: `메시지 추가 오류: ${messageData.error.message}`
            }, { status: 500 });
        }
        
        // 3. 어시스턴트 실행
        const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v2"
            },
            body: JSON.stringify({
                assistant_id: ASSISTANT_ID
            })
        });

        const runData = await runResponse.json();
        console.log(`실행 응답: ${JSON.stringify(runData)}`);
        
        if (runData.error) {
            return Response.json({
                error: `실행 오류: ${runData.error.message}`
            }, { status: 500 });
        }
            
        const runId = runData.id;
        if (!runId) {
            return Response.json({
                error: "실행 ID를 찾을 수 없습니다."
            }, { status: 500 });
        }
        
        // 4. 실행 완료 대기
        const maxAttempts = 30; // 최대 30초 대기
        let attempts = 0;
        let status = "";
        
        while (attempts < maxAttempts) {
            const runStatusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "OpenAI-Beta": "assistants=v2"
                }
            });

            const runStatusData = await runStatusResponse.json();
            console.log(`상태 확인 응답: ${JSON.stringify(runStatusData)}`);
            
            if (runStatusData.error) {
                return Response.json({
                    error: `상태 확인 오류: ${runStatusData.error.message}`
                }, { status: 500 });
            }
                
            status = runStatusData.status || "";
            console.log(`현재 상태: ${status}`);
            
            if (["completed", "failed", "cancelled", "expired"].includes(status)) {
                break;
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        }
        
        // 5. 어시스턴트의 응답 가져오기
        if (status === "completed") {
            const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "OpenAI-Beta": "assistants=v2"
                }
            });

            const messagesData = await messagesResponse.json();
            console.log(`메시지 응답: ${JSON.stringify(messagesData)}`);
            
            if (messagesData.error) {
                return Response.json({
                    error: `메시지 가져오기 오류: ${messagesData.error.message}`
                }, { status: 500 });
            }
            
            // 가장 최근 어시스턴트 메시지 찾기
            let assistantMessage = null;
            for (const message of messagesData.data || []) {
                if (message.role === "assistant") {
                    assistantMessage = message;
                    break;
                }
            }
            
            if (assistantMessage) {
                const contentList = assistantMessage.content || [];
                if (contentList.length > 0) {
                    const textContent = contentList[0].text || {};
                    const assistantContent = textContent.value || "응답 내용을 찾을 수 없습니다.";
                    
                    // 메타데이터 태그 제거
                    const cleanedContent = cleanAssistantResponse(assistantContent);

                    try {
                        // JSON 파싱 시도
                        const jsonResponse = JSON.parse(cleanedContent);
                        
                        // 파싱된 JSON이 올바른 형식인지 확인
                        if (jsonResponse.answer && typeof jsonResponse.answer === 'string') {
                            // MongoDB에 채팅 기록 저장
                            await saveChatHistory(
                                message, 
                                jsonResponse.answer || "", 
                                jsonResponse.recommendations || []
                            )
                            
                            return Response.json({
                                response: jsonResponse.answer,
                                recommendations: jsonResponse.recommendations || [],
                                thread_id: threadId
                            });
                        } else {
                            throw new Error('Invalid JSON structure');
                        }
                    } catch (jsonError) {
                        console.log("JSON 파싱 실패, 일반 텍스트로 처리:", jsonError);
                        console.log("원본 응답:", cleanedContent);
                        
                        // JSON 문자열이 포함된 경우 다시 추출 시도
                        let finalAnswer = cleanedContent;
                        let finalRecommendations = [];
                        
                        // JSON 패턴 찾기
                        const jsonMatch = cleanedContent.match(/\{[\s\S]*"answer"[\s\S]*\}/);
                        if (jsonMatch) {
                            try {
                                const extractedJson = JSON.parse(jsonMatch[0]);
                                if (extractedJson.answer) {
                                    finalAnswer = extractedJson.answer;
                                    finalRecommendations = extractedJson.recommendations || [];
                                }
                            } catch (e) {
                                console.log("JSON 추출 실패:", e);
                            }
                        }
                        
                        // 여전히 JSON 형식이면 기본 메시지 사용
                        if (finalAnswer.includes('"answer"') || finalAnswer.includes('"recommendations"')) {
                            finalAnswer = "죄송합니다. 응답을 처리하는 중 오류가 발생했습니다. 다시 시도해 주세요.";
                            finalRecommendations = [
                                "다른 질문을 해보세요",
                                "포트폴리오에 대해 알려주세요",
                                "기술 스택이 무엇인가요?"
                            ];
                        }
                        
                        // MongoDB에 채팅 기록 저장
                        await saveChatHistory(message, finalAnswer, finalRecommendations)
                        
                        return Response.json({
                            response: finalAnswer,
                            recommendations: finalRecommendations,
                            thread_id: threadId
                        });
                    }
                }
            }
        }
        
        if (status === "failed") {
            return Response.json({
                error: "어시스턴트 실행이 실패했습니다.",
                thread_id: threadId
            }, { status: 500 });
        } else if (status === "expired") {
            return Response.json({
                error: "어시스턴트 실행 시간이 만료되었습니다.",
                thread_id: threadId
            }, { status: 500 });
        } else {
            return Response.json({
                error: `응답을 받지 못했습니다. 상태: ${status}`,
                thread_id: threadId
            }, { status: 500 });
        }
    
    } catch (error) {
        console.error(`오류 발생: ${error.message}`);
        return Response.json({
            error: `서버 오류: ${error.message}`
        }, { status: 500 });
    }
}