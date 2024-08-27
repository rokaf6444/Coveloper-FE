import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Main from "./pages/Main2";
import WriteQnAPost from "./pages/QnAWrite";

import { getUserInfo, isLoggedIn, logout } from "./utils/auth";
/**
 * getUserInfo() : 토큰제출하고, 사용자 정보 가져옴
 * isLoggedIn() : localStorage에(쿠키) 토큰 있는지 확인
 * logout() : localStorage에서 토큰 제거
 */

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  useEffect(() => {
    //처음 메인 페이지 로드 시
    if (isLoggedIn()) {
      //로그인 되어있는지 확인, 로그인 한 상태면
      getUserInfo() //사용자 정보 가져옴
        .then((data) => {
          setUserInfo(data); //userInfo업데이트
        })
        .catch((error) => {
          console.error("Failed to fetch user info", error);
          logout();
          setUserInfo(null);
        });
    }
  }, []);

  //
  function handleLoginSuccess(token) {
    localStorage.setItem("token", token); //브라우저에 토큰 저장
    getUserInfo().then((data) => {
      //서버로부터 사용자 정보 가져옴
      setUserInfo(data); //가져온 정보를 userInfo에 저장
      navigate("/"); //로그인 성공 후 메인페이지로 리다이렉션
    });
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Main isLoggedIn={!!userInfo} userInfo={userInfo} />}
      />
      <Route path="/join" element={<Join />} />
      <Route
        path="/login"
        element={<Login onLoginSuccess={handleLoginSuccess} />}
      />
      <Route path="/writeqna" element={<WriteQnAPost />} />
    </Routes>
  );
}
export default App;
