# [About Me](https://port-0-aboutme-9z2ygb26lcbwua9l.gksl2.cloudtype.app/) - web[배포사이트 바로가기]
- Blender 와 Three.js 를 활용하여 VS-Code 내부로 들어가는 경험 제공
- 3가지의 프로젝트 소개
  - #### [first project: clock](https://github.com/jeonhyoungmin/project-hackathon)
  - #### [second project: ugauga](https://github.com/jeonhyoungmin/Stock_ProjectA)
  - #### [third project: meojeon_pass](https://github.com/jeonhyoungmin/ProjectB), [배포사이트 바로가기](http://43.200.117.50/)
<br/>

## 프로젝트 명세서
### 1. 개요
- 프로젝트 명: AboutMe
- 개발 인원: 1명
- 개발 기간: 2022. 12.25 - 2023.02.05 (1개월 12일)
- 개발 언어: JAVA 11

### 2. 프로젝트 기능
- **사용자 -** 회원가입 및 로그인, 회원정보 수정, 회원가입시 유효성 검사 및 중복 검사
- **게시판 -** 게시판 CRUD 기능, 조회수, 댓글 및 답글 수, 페이징 및 검색 처리
- **댓글 및 답글 -** 댓글 및 답글(대댓글) CRUD 기능

### 3. 사용 기술
#### 3-1. 백엔드

##### 프레임워크 / 라이브러리
- JAVA 11
- Spring (5.0.7)
- DB
  - MyBatis(3.5.13)
  - MyBatis-Spring(3.0.0)
  - MySQL-Connector/J(8.0.33) (JAVA JDBC)
  - Spring-JDBC(5.0.7 RELEASE)
  - AspectJ-Weaver(Transaction-Manager, 1.9.19)
- JUnit4
    - Spring TestContext Framework(JUnit for Spring, 5.0.7 RELEASE),
- JSON Library
    - Jackson-Databind(2.15.0)

##### DataBase
- MySQL(8.0)
- 
##### Server
- Tomcat(9.0.73)

##### Build Tool
- Maven

##### Deployment Environment
- AWS-EC2

##### Configuration Management
- Git(2.37.0)
- Git-Hub

#### 3-2. 프론트엔드
- Html/Css
- JavaScript
- JSP
