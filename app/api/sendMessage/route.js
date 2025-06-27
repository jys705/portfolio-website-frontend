// 환경 변수에서 API 키 및 Assistant ID 가져오기
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = process.env.ASSISTANT_ID;

// 메타데이터 태그 제거 함수
function cleanAssistantResponse(text) {
    // 【숫자:숫자†source】 형식의 메타데이터 제거
    return text.replace(/【\d+:\d+†source】/g, '');
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
                content: message
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
                    
                    return Response.json({
                        response: cleanedContent,
                        thread_id: threadId
                    });
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