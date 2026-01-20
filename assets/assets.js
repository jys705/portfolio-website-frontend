import code_icon from './code-icon.png';
import code_icon_dark from './code-icon-dark.png';
import edu_icon from './edu-icon.png';
import edu_icon_dark from './edu-icon-dark.png';
import project_icon from './project-icon.png';
import project_icon_dark from './project-icon-dark.png';
import vscode from './vscode.png';
import firebase from './firebase.png';
import figma from './figma.png';
import aws from './aws.png';
import aws_black from './aws-black.png';
import react from './react.png';
import react_black from './react-black.png';
import git from './git.png';
import mongodb from './mongodb.png';
import flask from './flask.png';
import kali from './kali.png';
import datadog from './datadog.png';
import snort from './snort.png';
import wireshark from './wireshark.png';
import sys from './sys.png';
import terraform from './terraform.png';
import shodan from './shodan.png';
import right_arrow_white from './right-arrow-white.png';
import logo from './logo.png';
import logo_dark from './logo_dark.png';
import security_icon from './security-icon.png';
import development_icon from './development-icon.png';
import cloud_icon from './cloud-icon.png';
import programming_icon from './programming-icon.png';
import mail_icon from './mail_icon.png';
import mail_icon_dark from './mail_icon_dark.png';
import profile_img from './profile-img2.jpg';
import profile_img1 from './profile-img1.jpg';
import profile_img2 from './profile-img2.jpg';
import download_icon from './download-icon.png';
import hand_icon from './hand-icon.png';
import header_bg_color from './header-bg-color.png';
import moon_icon from './moon_icon.png';
import sun_icon from './sun_icon.png';
import arrow_icon from './arrow-icon.png';
import arrow_icon_dark from './arrow-icon-dark.png';
import menu_black from './menu-black.png';
import menu_white from './menu-white.png';
import close_black from './close-black.png';
import close_white from './close-white.png';
import web_icon from './web-icon.png';
import mobile_icon from './mobile-icon.png';
import ui_icon from './ui-icon.png';
import graphics_icon from './graphics-icon.png';
import right_arrow from './right-arrow.png';
import send_icon from './send-icon.png';
import right_arrow_bold from './right-arrow-bold.png';
import right_arrow_bold_dark from './right-arrow-bold-dark.png';

export const assets = {
    code_icon,
    code_icon_dark,
    edu_icon,
    edu_icon_dark,
    project_icon,
    project_icon_dark,
    vscode,
    firebase,
    figma,
    aws,
    aws_black,
    react,
    react_black,
    kali,
    git,
    mongodb,
    flask,
    datadog,
    snort,
    wireshark,
    sys,
    terraform,
    shodan,
    right_arrow_white,
    logo,
    logo_dark,
    security_icon,
    development_icon,
    cloud_icon,
    programming_icon,
    mail_icon,
    mail_icon_dark,
    profile_img,
    profile_img1,
    profile_img2,
    download_icon,
    hand_icon,
    header_bg_color,
    moon_icon,
    sun_icon,
    arrow_icon,
    arrow_icon_dark,
    menu_black,
    menu_white,
    close_black,
    close_white,
    web_icon,
    mobile_icon,
    ui_icon,
    graphics_icon,
    right_arrow,
    send_icon,
    right_arrow_bold,
    right_arrow_bold_dark
};

export const workData = [
    {
        title: 'SecOps Pipeline',
        description: 'Cloud Security',
        bgImage: '/SecOps_Pipe.png',
        link: 'https://ten-joggers-efc.notion.site/SecOps-Pipeline-2e4c63a47d7d80679e28f91c31687fdc?source=copy_link'
    },
    {
        title: 'AWS Hardening',
        description: 'Terraform (IaC)',
        bgImage: '/AWS_Hard.png',
        link: 'https://ten-joggers-efc.notion.site/AWS-Hardening-2e4c63a47d7d8095a181db5339e21ff0?source=copy_link'
    },
    {
        title: 'Web Pentesting',
        description: 'Web Security',
        bgImage: '/Web_Pentesting.png',
        link: 'https://ten-joggers-efc.notion.site/Web-Pentesting-2e4c63a47d7d80218cbae8fa7d76de9b?source=copy_link'
    },
    {
        title: 'System Analysis',
        description: 'Security Operation',
        bgImage: '/SOC_Analysis.png',
        link: 'https://ten-joggers-efc.notion.site/SOC-Analysis-2e4c63a47d7d80b196a4f50de6b86115?source=copy_link'
    },
    {
        title: 'OSINT & CERT',
        description: 'Security Analysis',
        bgImage: '/OSINT_CERT.png',
        link: 'https://ten-joggers-efc.notion.site/OSINT-CERT-2e4c63a47d7d80f68536f425cfdd9a6e?source=copy_link'
    },
    {
        title: 'AI Policy Service App (Yuno)',
        description: 'Frontend (Project Leader)',
        bgImage: '/yuno.png',
        link: 'https://ten-joggers-efc.notion.site/AI-Policy-Service-App-Yuno-2e4c63a47d7d800eb0a5fc00341ad722?source=copy_link'
    },
]

export const serviceData = [
    { icon: assets.security_icon, title: 'Security', description: '시스템 보안, 웹 보안, 모의해킹에 이르기까지 보안의 전 과정을 아우르는 통합 솔루션을 제공합니다.', link: 'https://itcase.tistory.com/category/Security', techStack: 'Snort | Burp Suite | Sysinternals Suite | Shodan | Google Hacking' },
    { icon: assets.development_icon, title: 'Development', description: '웹의 프론트엔드부터 백엔드, 데이터베이스까지 전 과정을 안정적으로 설계하고 구현합니다.', link: 'https://itcase.tistory.com/category/Dev', techStack: 'Next.js | TypeScript | Flask | MongoDB | OpenAI API' },
    { icon: assets.programming_icon, title: 'Programming', description: 'Python과 Java를 중심으로 다양한 코딩 문제를 해결하며 문제 해결 능력을 키우고 있습니다.', link: 'https://itcase.tistory.com/category/Programming', techStack: 'Python | Java' },
    { icon: assets.cloud_icon, title: 'Cloud Native', description: 'AWS 기반의 보안이 내재화된 클라우드 아키텍처를 설계하고 운영합니다. 인프라 자동화부터 SecOps 파이프라인을 구성합니다.', link: 'https://itcase.tistory.com/category/Cloud%20Native', techStack: 'AWS | Terraform | Datadog SIEM | Auth0 | Cloudflare | Zero Trust' },
]

export const infoList = [
    { icon: assets.code_icon, iconDark: assets.code_icon_dark, title: 'Languages', description: 'Python, Java, HTML, CSS, JavaScript(React/Next.Js)' },
    { icon: assets.edu_icon, iconDark: assets.edu_icon_dark, title: 'Education', description: 'Kookmin University — School of Software' },
    { icon: assets.project_icon, iconDark: assets.project_icon_dark, title: 'Projects', description: 'Built more than 6 projects' }
];

export const toolsData = [
    { light: assets.mongodb, dark: assets.mongodb },
    { light: assets.aws, dark: assets.aws_black },
    { light: assets.terraform, dark: assets.terraform },
    { light: assets.datadog, dark: assets.datadog },
    { light: assets.git, dark: assets.git },
    { light: assets.shodan, dark: assets.shodan },
    { light: assets.snort, dark: assets.snort },
    { light: assets.wireshark, dark: assets.wireshark },
    { light: assets.sys, dark: assets.sys }
];
