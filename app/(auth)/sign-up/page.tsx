"use client";
import styles from "./sign-up.module.css"
import { Fraunces } from "next/font/google"

import { useState } from "react";




const fraunces = Fraunces({
    subsets: ["latin"],
    style: ["italic"],
    weight: ["300"],
})


export default function SignUp() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    return (
        <section className={styles.container1}>
            <section className={styles.left}>
                <section className={styles.create}>
                    <span className={styles.line}></span>
                    <span>Create your Account</span>
                </section>

                <section className={styles.box}>
                    <h1 className={fraunces.className}>Begin your <span className={fraunces.className} style={{ color: "#287EC9" }}>journey.</span></h1>
                    <p>Join thousands of dealers and private buyers who trust JC Export for sourcing,
                        inspecting, and shipping  premium Japanese vehicles worldwide.</p>
                </section>

                <section className={styles.box1}>
                    <section className={styles.box2}>
                        <h1 style={{ color: "#287EC9" }}>
                            100 <span style={{ color: "white" }}>%</span>

                        </h1>
                        <section>
                            <p>INSPECTION VERIFIED</p>
                        </section>

                    </section>


                    <section className={styles.box3}>
                        <h1 style={{ color: "#287EC9" }}>
                            48 <span style={{ color: "white" }}>h</span>

                        </h1>
                        <p>AVG RESPONSE</p>
                    </section>

                </section>


            </section>


            <section className={styles.right}>
                <section className={styles.r1}>
                    <span style={{ color: "#287EC9" }}>Create Account</span>

                    <h1 className={fraunces.className} style={{ color: "rgba(118, 119, 124, 1)" }}>Open your <span className={fraunces.className} style={{ color: "#287EC9" }}>portal</span></h1>

                    <p> Set up your client account in under a minute. No <br /> commitment required.</p>
                </section>

                <section className={styles.r2}>
                    <section>
                        <p>First Name</p>
                        <input placeholder="Ali" type="text" />
                    </section>


                    <section>
                        <p>Sure Name</p>
                        <input placeholder="khan" type="text" />
                    </section>



                </section>

                <section className={styles.r3}>


                    <section>
                        <p>Email Address</p>
                        <input type="email" placeholder="you@gmail.com" />
                    </section>

                    <section>
                        <p>Phone Number</p>
                        <input placeholder="+92 300 1234567" />
                    </section>

                    <section>
                        <p>Password</p>

                        <section>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="At least 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button className={styles.btn}
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </section>

                        {password.length > 0 && password.length < 8 && (
                            <p style={{ color: "red" }}>
                                Password must be at least 8 characters.
                            </p>
                        )}
                    </section>

                    

                </section>

             <section className={styles.line1}>
                <span className={styles.a}></span>
                <span className={styles.a1}></span>
                <span className={styles.a2}></span>
                <span className={styles.a3}></span>
             </section>


                <section className={styles.a4}>
                    <input type="checkbox" />

                    <p>I agree to JC Export’s <span style={{color : "#287EC9"}}>Term of Services</span>  and <span style={{color:"#287EC9"}}>Privacy Policy.</span> </p>
                </section>

                <section className={styles.btn3}>
                        <button className={styles.butn}>Create Account &rarr;</button>

                        <p className={styles.ac}>Already have an account? <span style={{color : "#287EC9"}}>Sign In</span></p>
                </section>


            </section>

        </section>
    )
}