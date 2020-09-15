# Cwitter

> Twitter Cloning with React and Firebase

## Firebase

### Firebase란

- 데이터베이스에서 시작, 현재는 웹에서 제공하는 백엔드 서비스
  - 이 프로젝트에서는 `Cloud Firestore`, `Authentication`, `Hosting`, `Cloud Storage` 사용
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
    // fbase.js
    
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

## Router Setup

- `react-router-dom`

  - [react-router-dom|docs](https://reactrouter.com/web/guides/quick-start)

  - `<Switch>` 를 사용한 Routing

  - `<Route />` 에 props로 컴포넌트를 넘겨주던 방식 -> `<Route></Router>` 컴포넌트를 감싸는 방식

    ```jsx
    // AppRouter.js
    
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
    ```

- React Hooks 활용

  - `AppRouter` 컴포넌트의 state를 React Hooks를 통해 관리
  - `isLoggedIn`의 상태에 따라 다른 Route들을 return
    - 삼항연산자를 통해

## Firebase Auth

### Firebase Auth

- [Firebase Docs|firebase.auth](https://firebase.google.com/docs/reference/js/firebase.auth)

- 기능 import

  - Firebase의 각 기능들을 사용하기 위해서는, firebase import와는 별개로 따로 import 해야 한다

  - 불러온 기능을 `fbase.js` 파일 내에서 실행한 후 export 하여 재사용하는 방식

    - 기능 자체를 export 하여 재사용하면 매번 실행하므로 비효율적일 수 있다

    ```js
    // fbase.js
    
    import * as firebase from "firebase/app";
    import "firebase/auth";
    
    const firebaseConfig = {
      ...
    };
    
    firebase.initializeApp(firebaseConfig);
    
    export const authService = firebase.auth();
    ```
  
- `firebase.auth()`

  - `Auth` 를 반환
  - 반환된 `Auth`와 그 properties / methods를 재사용
  - properties 예시
    - `currentUser`
  - methods 예시
    - `createUserWithEmailAndPassword()`
    - `onAuthStateChanged()`
    - `signInWithEmailAndPassword()`
    - `signInWithPopup()`
    - `signOut()`

### 절대경로 import 설정

- `baseUrl` 설정

  - 기존의 `../components` 와 같은 상대경로 import를 `component` 와 같은 절대경로로 import 할 수 있다

    - `src/components` 일 때

  - 프로젝트 root dir에 `jsconfig.json` 을 작성

    - `compilerOptions` 중 `baseUrl` 과 `include`를 설정

    ```json
    {
      "compilerOptions": {
        "baseUrl": "src"
      },
      "include": ["src"]
    }
    ```


### HTML Symbols

- [w3schools|HTML Symbols](https://www.w3schools.com/html/html_symbols.asp)
  - Many mathematical, technical, and currency symbols, are not present on a normal keyboard.
  - To add such symbols to an HTML page, you can use the entity name or the entity number (a decimal or a hexadecimal reference) for the symbol.
- 예시
  - `&copy;` => &copy;
  - `&reg;` => &reg;

### Set Up Sign-in Method of Firebase Project

> console -> Authentication -> Sign-in method

- Sign-in method

  - [Firebase|Authentication Sign-in method](https://console.firebase.google.com/u/0/project/cwitter-6d56a/authentication/providers)

  - 사용할 로그인 방법을 수동으로 설정

    - ex) 이메일/비밀번호, Google, GitHub
    - Google method 는 지원 이메일 필요
    - Github method는 Client ID와 Secret Key 필요

  - Setup for Github method

    > Github -> Settings -> Developer Settings -> OAuth Apps -> New OAuth App

    - 앱 이름, 홈페이지 URL, Authorization callback URL을 입력한 후 Register
      - 이때, 콜백 URL은 Firebase에서 제공하는 콜백 URL을 사용
      - 홈페이지 URL은 콜백 URL의 Root 주소를 사용
    - 등록 후 제공되는 Client ID와 Client Secret을 Firebase 에 입력한 후 저장

### Create Account

- `EmailAuthProvider`
  - [Firebase|Authentication EmailAuthProvider](https://firebase.google.com/docs/reference/js/firebase.auth.EmailAuthProvider)
- Form 재사용
  - `Auth` 컴포넌트는 state로 `newAccount`를 가지고, 해당 값이 true일 때는 `createUserWithEmailAndPassword`를, false일 때는 `signInWithEmailAndPassword` 를 실행
  - 두 가지 모두 email과 password를 받아서 로그인하지만, 전혀 다른 흐름
    - 같은 form 및 input들을 재사용해 두가지 흐름 가능

- `createUserWithEmailAndPassword`

  - [Firebase|Authentication createUserWithEmailAndPassword](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createuserwithemailandpassword)

  - ``` 
    Creates a new user account associated with the specified email address and password.
    
    On successful creation of the user account, this user will also be signed in to your application.
    
    User account creation can fail if the account already exists or the password is invalid.
    
    Note: The email address acts as a unique identifier for the user and enables an email-based password reset. This function will create a new user account and set the initial user password.
    ```

- `signInWithEmailAndPassword`

  - [Firebase|Authentication signInWithEmailAndPassword](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signinwithemailandpassword)

  - ```
    Asynchronously signs in using an email and password.
    
    Fails with an error if the email address and password do not match.
    
    Note: The user's password is NOT the password used to access the user's email account. The email address serves as a unique identifier for the user, and the password is used to access the user's account in your Firebase project.
    ```

- `setPersistence`

  - [Firebase|Authentication setPersistence](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#setpersistence)
  - 유저를 어떻게 유지할 것인지 방법을 선택하는 method
  - [Supported types of Auth state persistence](https://firebase.google.com/docs/auth/web/auth-state-persistence)
    - local : 브라우저를 닫아도 유지
    - session : 세션 종료 전까지 유지
    - none : 유지하지 않음
    - default는 local

  - `Application -> Storage -> IndexedDB -> firebaseLocalStorageDb` 에서 유저 유지 확인 가능 (local인 경우)
  - 