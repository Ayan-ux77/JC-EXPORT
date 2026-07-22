
"use client";
import styles from "./sign-in.module.css"
import { Fraunces } from "next/font/google"
import { GoLock } from "react-icons/go";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { SiApple } from "react-icons/si";


const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["300"],
})

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className={styles.containers}>
      <section className={styles.left}>
        <section className={styles.access}>
          <span className={styles.line}></span>
          <span>Access your Account</span>
        </section>

        <section className={styles.container1}>
          <h1>
            Welcome{" "}
            <span
              className={fraunces.className}
              style={{ color: "#287EC9" }}
            >
              back.
            </span>
          </h1>

          <p>
            Sign in to track your shipments, view inspection reports, and
            manage your vehicle orders — all in one place.
          </p>
        </section>

        <section className={styles.box2}>
          <section>
            <h1>
              15<span style={{ color: "white" }}>+</span>
            </h1>
            <p style={{ color: "white" }}>Years Exporting</p>
          </section>

          <section>
            <h1>32</h1>
            <p style={{ color: "white" }}>Countries Served</p>
          </section>

          <section>
            <h1>
              1400<span style={{ color: "white" }}>+</span>
            </h1>
            <p style={{ color: "white" }}>Vehicles Shipped</p>
          </section>
        </section>
      </section>

      <section className={styles.right}>
        <section className={styles.a1}>
          <span style={{ color: "rgba(40, 126, 201, 1)" }}>
            Sign In
          </span>

          <h1>
            Access your{" "}
            <span style={{ color: "rgba(40, 126, 201, 1)" }}>
              account
            </span>
          </h1>

          <p >
            Enter your credentials to continue to the JC Export client
            <br />
            portal.
          </p>

          <section className={styles.box3}>

            <section className={styles.ea}>
              <p>Email Address</p>
              <input type="email" placeholder="you@gmail.com" />
            </section>

            <section className={styles.passwordBox}>

              <p>Password</p>

              <section className={styles.pb}>

                <section className={styles.pb1}>

                  <GoLock className={styles.icon} />

                  <input
                    placeholder="enter your password" type={showPassword ? "text" : "password"}
                  />

                </section>

                <span
                  className={styles.btn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}

                </span>
              </section>


              <section className={styles.ch}>
                <section className={styles.ch1}>
                  <label className={styles.remember}>
                    <input type="checkbox" />
                    Remember me?
                  </label>

                  <span className={styles.forgot}>
                    Forget Password
                  </span>
                </section>

              </section>

              <section className={styles.butn}>
                <button className={styles.btn2}>Sign In  &rarr;</button>
              </section>


              <section className={styles.l1}>
                <div className={styles.lines1}></div>
                <span>or</span>
                <div className={styles.lines2}></div>
              </section>

              <section className={styles.butnga}>
                <button className={styles.googlebtn}><FcGoogle className={styles.ic} /> Continue with Google</button>
                <button className={styles.Applebtn}><SiApple className={styles.ic1} />Continue with Apple</button>
              </section>



            </section>

            {/* <section className={styles.border}>
              <section>
                <h1>15 +</h1>
                <p>Exporting</p>
                <span className={styles.ln}></span>
              </section>

              <section>
                <h1>4200 +</h1>
                <p>Vehicles Shipped</p>
                <span className={styles.ln}></span>
              </section>

              <section>
                <h1>32</h1>
                <p>Countries Served</p>
                <span className={styles.ln}></span>
              </section>

              <section>
                <h1>98 <span style={{color : "red"}}>%</span></h1>
                <p>Client Retention</p>
                <span className={styles.ln}></span>
              </section>
            </section> */}


          </section>
        </section>
      </section>
    </section>
  )
}
