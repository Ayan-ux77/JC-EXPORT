
import styles from "./verify-otp.module.css"
import { Fraunces } from "next/font/google"

const fraunces = Fraunces({
    subsets: ["latin"],
    style: ["italic"],
    weight: ["300"],
})

export default function VerifyOtp() {


    return (
        <section className={styles.container1}>
            <section className={styles.left}>
                <section className={styles.tf}>
                    <span className={styles.line}></span>
                    <span>Two Factor verification</span>
                </section>

                <section className={styles.box}>
                    <h1 className={fraunces.className}>One last <span style={{ color: "rgba(40, 126, 201, 1)" }}>step.</span></h1>
                    <p>
                        Join thousands of dealers and private buyers who trust JC Export for sourcing, inspecting, and shipping premium Japanese vehicles worldwide.
                    </p>
                </section>

                <section className={styles.box1}>
                    <section className={styles.box2}>
                        <h1 style={{ color: "rgba(40, 126, 201, 1)" }}>10 <span style={{ color: "white" }}>min</span></h1>
                        <p>CODE VALIDITY</p>
                    </section>

                </section>

            </section>

            <section className={styles.right}>

                <section className={styles.r1}>
                    <span style={{ color: "#287EC9" }}>verification</span>

                    <h1>Enter the <span style={{ color: "#287EC9" }}>code</span></h1>

                    <p>
                        A 6-digit code was sent to y••••@company.com. It
                        expires in 10 minutes.
                    </p>


                </section>

                <section className={styles.boxes}>

                    <section className={styles.boxes1}>
                        <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} />
                        <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} />
                        <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} />
                        <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} />
                        <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} />
                         

                    </section>

                  


                </section>

                


                <section className={styles.btn}>
                    <button className={styles.butn}> Verify & Continue &rarr;</button>

                    <section className={styles.ac}>
                        <p >Didn’t receive the code? <span style={{ color: "#287EC9" }}>Resend in 0:42 </span></p>

                        <p className={styles.ac1}>Wrong email? <span style={{ color: "#287EC9" }}>Go back</span></p>
                    </section>


                </section>

            </section>

        </section>


    )
}