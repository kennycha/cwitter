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

### Firebase Sign-in Method 설정

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

### 이메일 로그인 구현

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

### 앱 초기화 시 유저 체크

> 로그인 후 리렌더링 될 떄, 계정 생성 버튼이 로그인 버튼으로 바뀌지 않는 문제 -> 유저 정보를 로컬에서 읽어오기 전에 리렌더딩 해버리기 때문

- `useEffect`

  - 클래스형 컴포넌트의 life cycle에 해당하는 hook

    - {} 안의 내용은 mounted
    - [] 안의 내용은 updated
    - return 문의 내용은 unmounted

  - render시 auth state 변화를 감지하는 `onAuthStateChanged` 이벤트 정의

    ```jsx
    useEffect(() => {
        authService.onAuthStateChanged((user) => console.log(user));
      }, []);
    ```

- `onAuthStateChanged`
  - [Firebase|Authentication onAuthStateChanged](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onauthstatechanged)
  - Adds an observer for changes to the user's sign-in state
  - 콜백함수를 인자로 받아, auth state에 변화가 생길 때마다 호출

### Social Login 구현

- `signInWithPopup`

  - [Firebase|Authentication signInWithPopup](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signinwithpopup)

  - social login 제공자에 따라 provider를 생성하고, 이를 인자에 담아서 `signInWithPopup` method를 호출

    - 이때, 버튼 `name` property에 따라 해당하는 제공자의 provider를 생성

    ```js
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    ```

### 로그아웃 구현

- `signOut`

  - [Firebase|Authentication signOut](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signout)
  - Signs out the current user

- Redirect

  - 로그아웃 후에 홈 페이지로 redirect

  - `react-router-dom` 

  - `<Redirect>` 

    - [react-router-dom|Redirect](https://reactrouter.com/web/api/Redirect)

    - Rendering a `<Redirect>` will navigate to a new location

    - Router의 가장 마지막에 작성

    - `from` 과 `to` 를 통해, Route 들에 해당하지 않는 주소를 처리

      ```jsx
      import React from "react";
      import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
      
      const AppRouter = () => {
        return (
          <Router>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/profile">
                <Profile />
              </Route>
              <Redirect from='*' to='/' />
            </Switch>
          </Router>
        );          
      };
      
      export default AppRouter;
      ```

- `useHistory`

  - [react-router-dom|useHistory](https://reactrouter.com/web/api/Hooks/usehistory)

  - The `useHistory` hook gives you access to the `history` instance that you may use to navigate

  - history 를 사용하기 위한 hook

    - 기존에 사용하던 `withRouter` 를 사용할 필요 없다
    - `push` method를 통해 원하는 주소로 보낼 수 있다

    ```jsx
    const history = useHistory();
    const onLogOutClick = () => {
      authService.signOut();
      history.push("/");
    };
    ```

### 프로필 업데이트

- `User` 의 `updateProfile` method 사용

  - [Firebase|Authentication - User - updateProfile](https://firebase.google.com/docs/reference/js/firebase.User#updateprofile)

    ```
    Updates a user's profile data.
    ```

  - `updateProfile`을 통해서는 `displayName` , `photoURL` 등 제한적인 정보들만 변경할 수 있다

    ```jsx
    userObj.updateProfile({
      displayName: newDisplayName,
      // photoURL: newPhotoURL
    })
    ```

  - `User` 에 대해 더 많은 정보들을 저장 및 변경하고 싶다면, firestore에 해당 `Users` collection을 생성해 각 User에 대한 `Document`를 생성해 정보를 담을 수 있다

- firebase 상으로는 업데이트가 일어나도 렌더링에 반영되지 않는 버그

  - React는 변화를 감지했을 때 이를 반영하기 위해 리렌더링

  - firebase의 `User` 가 매우 복잡하고 큰 객체이기 때문에, 변화를 감지하지 못하는 경우가 있다

  - firebase의 `User` 를 앱 내에서 사용할 때에, 필요한 부분만 가져온 간단하고 작은 객체를 새로 정의해 사용하는 방식으로 해결 가능

    - 즉, firebase 언어를 react 언어로 연결해주는 방식으로 해결

    ```jsx
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      }
      setInit(true);
    });
    ```

## Firebase Firestore

### Firestore DB 생성

- 데이터베이스 생성

  > Firebase 콘솔 -> Cloud Firestore -> 데이터베이스 만들기

  - 모드는 `test mode` , 지역은 `asia-northeast1`

- App과 DB 연결

  - `fbase.js` 파일에서 `firebase/firestore` import 한 후 호출 및 export 

  - ```js
    // fbase.js
    
    import "firebase/firestore";
    // ...
    export const dbService = firebase.firestore()
    ```

### Cloud Firestore

- [Firebase Docs|firestore](https://firebase.google.com/docs/reference/js/firebase.firestore)

### Collections

- [Firebase Docs|firestore CollectionReference](https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference)
- 폴더와 유사
  - `like a group of documents`

### Document

- [Firebase Docs|firestore DocumentReference](https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference)
- 폴더(Collections)에 위치한 문서와 유사

### Document 생성

- Console을 통한 생성
  - `firebase console` -> `cloud firestore` -> `컬렉션 시작`
  - 문서 ID, 필드, 유형, 값들을 직접 입력해 Document 수동 생성 가능
- 코드로 생성
  - Home 에 있는 Form의 `onSubmit` 이벤트마다, 특정 Collection에 Document를 생성하도록 구현
  - firestore의 `collection` method를 통해, 특정 collection에 접근
    - collection Id를 str으로 넣어서 호출
    - collection reference를 return
    - 존재하지 않는 Id일 경우 해당 Id로 collection 생성 후 collection reference를 return
  - Collection Reference의 `add` method를 사용
    - [Firebase Docs|firestore CollectionReference - add Method](https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#add)

### Document 접근

- Collection Reference의 `get` method를 사용
  - [Firebase Docs|firestore CollectionReference - get Method](https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#get)
  - `QuerySnapshot` 을 return

- `QuerySnapshot`

  - [Firebase Docs|firestore QuerySnapshot](https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot)

    ```
    A QuerySnapshot contains zero or more DocumentSnapshot objects representing the results of a query. The documents can be accessed as an array via the docs property or enumerated using the forEach method. The number of documents can be determined via the empty and size properties.
    ```

  - `DocumentSnapshot` 을 0개 이상 포함

  - array 처럼 사용 가능하며, `forEach`를 통해 각각의 `DocumentSnapshot` 에 접근

- `DocumentSnapshot`

  - [Firebase Docs|firestore DocumentSnapshot](https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot)

    ```
    A DocumentSnapshot contains data read from a document in your Firestore database. The data can be extracted with .data() or .get(<field>) to get a specific field.
    ```

  - [data](https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot#data) method를 통해 각 document의 내용을 가져올 수 있다

    ```
    Retrieves all fields in the document as an Object. Returns 'undefined' if the document doesn't exist.
    ```

- `useState` 함수적 갱신

  - [React Docs|useState - functional updates](https://ko.reactjs.org/docs/hooks-reference.html#functional-updates)

    ```
    If the new state is computed using the previous state, you can pass a function to setState. The function will receive the previous value, and return an updated value. 
    ```

  - 이전 state를 사용해서 새로운 state를 계산한다면, 함수를 `setState` 의 인자로 넘겨줄 수 있다

    - 이 경우, 함수는 state의 이전 상태를 받아온다

  - ```jsx
    // Home.js
    
    const [cweets, setCweets] = useState([]);
    // ...
    dbCweets.forEach((document) => {
      const cweetObject = {
        ...document.data(),
        id: document.id,
      };
      setCweets((prev) => [cweetObject, ...prev]);
    });
    // ...
    ```

### 작성자를 포함한 Document 생성

- `App` 에서 현재 user 정보를 가지고, props로 내려주는 방식
  - `onAuthStateChanged` 를 통해, 로그인 여부 판단 과정에서 로그인 중이라면 해당 user를 현재 user로 `userObj` state에 저장
- `user` object의 `uid` property를 사용
  - `onSubmit `이벤트로 cweet을 작성할 때, 현재 user의 `uid`를 `creatorId` 필드에 저장하여 document를 생성

### Realtime Cweets

- `onSnapshot` 을 이용한 Document 접근

  - [Firebase Docs|firestore onSnapshot](https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#onsnapshot)

    ```
    Attaches a listener for QuerySnapshot events. You may either pass individual onNext and onError callbacks or pass a single observer object with next and error callbacks. The listener can be cancelled by calling the function that is returned when onSnapshot is called.
    ```

  - firestore 내 사항(CRUD)을 realtime으로 알려주는 listener

    - `useEffect` 를 통해 첫 rendering 시에 적용

  - 콜백함수를 통해 cweets 를 get 해오면, firestore 변경에 따라 rendering 이 변화하는 realtime cweets viewer가 가능

    ```jsx
    const Home = ({ userObj }) => {
      const [cweets, setCweets] = useState([]);
      useEffect(() => {
        dbService.collection("cweets").onSnapshot((snapshot) => {
          const cweetArray = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCweets(cweetArray);
        });
      }, []);
        
      return (
        <div>
          {cweets.map((cweet) => (
            <div key={cweet.id}>
              <h4>{cweet.text}</h4>
            </div>
          ))}
        </div>
      )
    }
    export default Home;
    ```

### Document 삭제

- `DocumentReference` 의 `delete` method를 사용

  - [Firebase Docs|firestore DocumentReference - delete Method](https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#delete)

    ```
    Deletes the document referred to by this DocumentReference.
    ```

  - `DocumentReference`는  `firestore`의 `doc` method를 통해 얻을 수 있다

  - ```jsx
    dbService.doc(`cweets/${cweetObj.id}`).delete()
    ```

### Document 수정

- `DocumentReference` 의 `delete` method를 사용

  - [Firebase Docs|firestore DocumentReference - update Method](https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#update)

    ```
    Updates fields in the document referred to by this DocumentReference. The update will fail if applied to a document that does not exist.
    ```

  - 삭제와 동일하게 `DocumentReference`을 가져온 후, 수정하려는 `field`와 `value` 와 함께 `update` method를 호출

  - ```jsx
    dbService.doc(`cweets/${cweetObj.id}`).update({
       text: newCweet,
    });
    ```

- `Boolean` 

  - `Boolean` 객체

    - Boolean 객체는 불리언 값을 감싸고 있는 객체

    ```
    첫 번재 매개변수로서 전달한 값은 필요한 경우 불리언 값으로 변환됩니다. 값이 없거나 0, -0, null, false, NaN, undefined, 빈 문자열 ("")이라면 객체의 초기값은 false가 됩니다. 문자열 "false"를 포함한 그 외 모든 다른 값은 초기값을 true로 설정합니다.
    ```

  - `Boolean()`

    - `Boolean` 객체 생성자 함수

## Firebase Storage

### Storage

- [Firebase Docs|storage](https://firebase.google.com/docs/reference/js/firebase.storage)

  - 생성

    - `firebase console` -> `Storage` -> `Storage 생성`

  - 적용

    ```js
    import "firebase/storage";
    // ... 
    export const storageService = firebase.storage();
    ```

    

  - `bucket`

    - 파일을 저장하는 공간

### FileReader API를 통해 업로드한 파일 읽기

- `<input />` with `type='file'`

  - file 을 입력받는 input 태그

  - `files` 속성을 통해 입력된 파일 리스트 확인 가능

    ```jsx
    const {
      target: { files },
    } = event;
    ```

    - cf) text 타입인 input의 경우 `value` 속성을 통해 값을 확인

- `FileReader` API

  - [MDN|FileReader](https://developer.mozilla.org/ko/docs/Web/API/FileReader)

  - 생성자 함수 

    - `FileReader()`

      ```js
      const reader = new FileReader()
      ```

  - `FileReader` 객체의 `readAsDataURL()` method 를 사용

    - [MDN|FileReader - readAsDataURL](https://developer.mozilla.org/ko/docs/Web/API/FileReader/readAsDataURL)

      ```
      readAsDataURL 메서드는 컨텐츠를 특정 Blob 이나 File에서 읽어 오는 역할을 합니다. 읽어오는 read 행위가 종료되는 경우에, readyState 의 상태가 DONE이 되며, loadend 이벤트가 트리거 됩니다. 이와 함께 base64 인코딩 된 스트링 데이터가 result 속성(attribute)에 담아지게 됩니다.
      ```

    - `blob` 을 파라미터로 받아 읽음

      - 이때 `blob`은 읽고자 하는 Blob 또는 File

  - `Blob`

    - [MDN|Blob](https://developer.mozilla.org/ko/docs/Web/API/Blob)

      ```
      Blob 객체는 파일류의 불변하는 미가공 데이터를 나타냅니다. 텍스트와 이진 데이터의 형태로 읽을 수 있으며, ReadableStream으로 변환한 후 그 메서드를 사용해 데이터를 처리할 수도 있습니다.
      
      Blob은 JavaScript 네이티브 형태가 아닌 데이터도 표현할 수 있습니다. File 인터페이스는 사용자 시스템의 파일을 지원하기 위해 Blob 인터페이스를 확장한 것이므로, 모든 블롭 기능을 상속합니다.
      ```

  - `Blob`에서 데이터 추출하기

    - ```
      블롭에서 데이터를 읽는 방법 하나는 `FileReader`를 사용하는 것입니다. 다음 코드는 `Blob`의 콘텐츠를 형식 배열로서 읽어 들입니다. 
      ```

      ```js
      const reader = new FileReader();
      reader.addEventListener('loadend', () => {
         // reader.result contains the contents of blob as a typed array
      });
      reader.readAsDataURL(blob);
      ```

    - `React` 에서는 `FileReader` 객체 인스턴스의 `onloadend` 메서드를 통해 이벤트리스너를 붙일 수 있다

      ```jsx
      const reader = new FileReader();
      reader.onloadend = (finishedEvent) => {
        console.log(finishedEvent);
      };
      reader.readAsDataURL(theFile);
      ```

### 업로드한 파일 Storage에 저장

- 흐름

  - 먼저 업로드한 파일이 있다면 이를 storage에 저장
  - 저장한 파일의 url을 가져옴
  - 가져온 url을 포함시켜서 cweet 생성

- `ref` method 사용

  - [Firebase Docs|storage - ref method](https://firebase.google.com/docs/reference/js/firebase.storage.Storage#ref)

    ```
    Returns a reference for the given path in the default bucket.
    ```

  - `Reference` 객체를 반환

    - [Firebase Docs|storage - Reference](https://firebase.google.com/docs/reference/js/firebase.storage.Reference)

      ```
      Represents a reference to a Google Cloud Storage object. Developers can upload, download, and delete objects, as well as get/set object metadata.
      ```

- `child` method를 통해, 반환된 `Reference` 아래에 폴더구조와 유사하게 상대 경로를 만들고 그 Reference 를 사용

  - [Firebase Docs|storage - Reference - child method](https://firebase.google.com/docs/reference/js/firebase.storage.Reference#child)

  - 이때, 현재 `userObj`의 `uid` 와 `uuid` 를 통해 생성된 고유 식별자를 조합해 child를 생성

    - 유저 아이디로 구분된 구조로 만들기 위해

    ```jsx
    const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
    ```

- `putString ` method를 통해 해당 Reference의 위치에 data를 저장

  - [Firebase Docs|storage - Reference - putString method](https://firebase.google.com/docs/reference/js/firebase.storage.Reference#putstring)

    ```
    Uploads string data to this reference's location.
    ```

  - `data` 와 `format` 을 넣어서 호출

    ```jsx
    fileRef.putString(attachment, "data_url");
    ```

  - `UploadTask` 객체를 반환

- `uuid` 

  - [npm|uuid](https://www.npmjs.com/package/uuid)

    - 고유한(unique) 식별자를 랜덤 생성하는 패키지

  - 설치

    ```bash
    npm install uuid
    ```

  - 사용

    ```js
    import { v4 as uuidv4 } from 'uuid';
    uuidv4(); // ⇨ ex) '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
    ```

### Storage 파일을 포함한 Document 생성

- `UploadTask` 의 Reference를 이용

  - [Firebase Docs|storage - UploadTask](https://firebase.google.com/docs/reference/js/firebase.storage.UploadTask)

    ```
    Represents the process of uploading an object. Allows you to monitor and manage the upload.
    ```

  - [Firebase Docs|storage - UploadTaskSnapshot](https://firebase.google.com/docs/reference/js/firebase.storage.UploadTaskSnapshot)

    ```
    Holds data about the current state of the upload task.
    ```

  - `getDownloadURL` method를 사용

    - [Firebase Docs|storage - getDownloadURL](https://firebase.google.com/docs/reference/js/firebase.storage.Reference#getdownloadurl)

      ```
      Fetches a long lived download URL for this object.
      ```

    - ```jsx
      const attachmentUrl = await response.ref.getDownloadURL()
      ```

### Document와 함께 포함된 Storage 파일도 삭제

- `Storage` 의 `refFromURL` method 사용

  - [Firebase Docs|storage - Storage - refFromURL](https://firebase.google.com/docs/reference/js/firebase.storage.Storage#reffromurl)

    ```
    Returns a reference for the given absolute URL.
    ```

  - url 을 받아 대상의 reference를 반환하는 method

- 반환된 `Reference`의 `delete` method 로 삭제

  - [Firebase Docs|storage - Reference - delete](https://firebase.google.com/docs/reference/js/firebase.storage.Reference#delete)

    ```
    Deletes the object at this reference's location
    ```

  - Reference의 위치에 있는 대상을 삭제

  - ```jsx
    await storageService.refFromURL(cweetObj.attachmentUrl).delete()
    ```

## Firestore Query

### Firestore 에서 Document 가져오기

- `CollectionReference` 의 method 들을 사용

  - `get` method

    - [Firebase Docs|storage - CollectionReference - get](https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#get)

      ```
    Executes the query and returns the results as a QuerySnapshot.
      ```

  - `limit` method

    - [Firebase Docs|storage - CollectionReference - limit](https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#limit)
  
      ```
      Creates and returns a new Query that only returns the first matching documents.
      ```
  
  - `orderBy` method
  
    - [Firebase Docs|storage - CollectionReference - orderBy](https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#orderby)
  
      ```
      Creates and returns a new Query that's additionally sorted by the specified field, optionally in descending order instead of ascending.
      ```
  
  - `where` method
  
    - [Firebase Docs|storage - CollectionReference - where](https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#where)
  
      ```
      Creates and returns a new Query with the additional filter that documents must contain the specified field and the value should satisfy the relation constraint provided.
      ```
  
  - `onSnapshot` listener
  
    - [Firebase Docs|storage - CollectionReference - onSnapshot](https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#onsnapshot)
  
      ```
      Attaches a listener for QuerySnapshot events. You may either pass individual onNext and onError callbacks or pass a single observer object with next and error callbacks. The listener can be cancelled by calling the function that is returned when onSnapshot is called.
      ```
  
- pre-made query

  - firebase 의 firestore는 noSQL 기반이기 때문에, index를 필요로 하는 몇몇 기능들은 동작하지 않을 수 있다

    ```
    Uncaught (in promise) FirebaseError: The query requires an index.
    ```

  - 제대로 동작하도록 하기 위해서는 `index` 를 만들어줘야 하고, Error 문에서 알려주는 주소를 통해 해당하는 `index`를 사전적으로 만들 수 있다

    - 주소로 이동하면 `복합 색인 만들기` 팝업이 있고, `색인 만들기` 를 클릭해 간단하게 `index`를 생성할 수 있다
