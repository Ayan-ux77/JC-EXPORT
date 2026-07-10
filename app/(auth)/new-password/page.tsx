"use client"

import styles from "./new-password.module.css"
import { Fraunces } from "next/font/google"
import { FcCheckmark } from "react-icons/fc";
import { GoLock } from "react-icons/go";
import { useState } from "react";

const fraunces = Fraunces({
    subsets: ["latin"],
    style: ["italic"],
    weight: ["300"],
})

export default function NewPassword() {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <section className={styles.container1}>

            <section className={styles.left}>
                <section className={styles.fs}>
                    <span className={styles.line}></span>
                    <span>Final Step</span>
                </section>

                <section className={styles.box}>
                    <h1 className={fraunces.className}>
                        Set a <span style={{ color: "rgba(40, 126, 201, 1)" }}> new password.</span>
                    </h1>
                    <p>
                        Choose something memorable but secure. We recommend at least 12 characters with a mix of letters, numbers, and symbols.
                    </p>
                </section>

                <section className={styles.box1}>
                    <section className={styles.box2}>
                        <FcCheckmark className={styles.box3} />
                        <p>IDENTITY VERIFIED</p>
                    </section>
                </section>
            </section>

            <section className={styles.right}>

                <section className={styles.r1}>
                    <h1>Create a <span style={{ color: "rgba(40, 126, 201, 1)" }}>new password</span></h1>
                    <p>Youre almost done. Set a strong password to secure your account.</p>
                </section>

                <section className={styles.passwordBox}>

                    <p>New Password</p>

                    <section className={styles.pb}>
                        <section className={styles.pb1}>
                            <GoLock className={styles.icon} />
                            <input
                                placeholder="enter your password"
                                type={showPassword ? "text" : "password"}
                            />
                        </section>

                        <span
                            className={styles.btn}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </span>
                    </section>

                    <section className={styles.line1}>
                        <span className={styles.a}></span>
                        <span className={styles.a1}></span>
                        <span className={styles.a2}></span>
                        <span className={styles.a3}></span>
                    </section>

                    <span style={{ color: "green" }}>Strong Password <FcCheckmark className={styles.b1} /></span>

                </section>

                <section className={styles.passwordBox1}>

                    <p>Confirm Password</p>

                    <section className={styles.pbb}>
                        <section className={styles.pbb1}>
                            <GoLock className={styles.icon1} />
                            <input
                                placeholder="enter your password"
                            />
                        </section>
                    </section>

                </section>

                <section className={styles.btn1}>
                    <button className={styles.butn}> Save & Sign In &rarr;</button>

                    <section className={styles.ac}>
                        <p >Need Help ? <span style={{ color: "#287EC9" }}> Contact Support </span></p>

                    </section>


                </section>

            </section>

        </section>
    )
}