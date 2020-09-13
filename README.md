# Cwitter

> Twitter Cloning with React and Firebase

## Firebase

### Firebase란

- 데이터베이스에서 시작, 현재는 웹에서 제공하는 백엔드 서비스
- 링크
  - [Firebase|What can I use](https://firebase.google.com/products)
  - [Firebase Docs|Web 개발 Ref](https://firebase.google.com/docs/reference/js?authuser=0)

## Firebase Setup

### Firebase 프로젝트 적용

> in Node.js way

- `npm`을 사용한 방식

  - firebase module 설치

    ```bash
    npm install --save firebase
    ```

  - firebase 설정파일 생성

    ```js
    // firebase.js
    
    import * as firebase from "firebase/app";
    
    const firebaseConfig = {
      apiKey: "API_KEY",
      authDomain: "PROJECT_ID.firebaseapp.com",
      databaseURL: "https://PROJECT_ID.firebaseio.com",
      projectId: "PROJECT_ID",
      storageBucket: "PROJECT_ID.appspot.com",
      messagingSenderId: "SENDER_ID",
      appId: "APP_ID",
      measurementId: "G-MEASUREMENT_ID",
    };
    export default firebase.initializeApp(firebaseConfig);
    ```

### CRA 프로젝트에서 Key 보안

- `.env` 파일에 저장할 때, 각 Key의 이름은 `REACT_APP_` 으로 시작해야 한다
  - ex) `apiKey -> REACT_APP_API_KEY`
- 사용할 때는 `process.env.Key이름` 를 통해 접근

- `.gitignore` 에 `.env` 를 추가해 git 관리 대상에서 제외
  - 하지만 서비스를 위해 빌드하는 경우 CRA가 실제 값들로 변환시켜 사용하기 때문에 절대적으로 숨길 수는 없다
  - 특정 도메인에서만 해당 키를 사용할 수 있도록 하는 등 다른 보안적인 방법들을 함께 사용