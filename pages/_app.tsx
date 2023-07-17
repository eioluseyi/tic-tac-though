import { FC } from "react";
import { ToastContainer } from "react-toastify";
import "public/assets/css/global.css";
import "react-toastify/dist/ReactToastify.css";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({
  Component,
  pageProps,
}: {
  Component: FC;
  pageProps: { [key: string]: any };
}) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
