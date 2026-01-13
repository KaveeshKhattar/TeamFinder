// import Contents from "./Contents";
// import Footer from "./Footer";
// import Header from "./Header";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { motion } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../../../config";

function LandingPage() {
  const [string, setString] = useState("");

  return (
    <div className="flex flex-col justify-center p-4 items-center bg-gradient-to-br from-blue-700 to-zinc-700 text-white min-h-screen">
      {/* <Header></Header>
            <Contents></Contents>
            <Footer></Footer> */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <div className="">
          <h1 className="font-bold text-blue-300">TeamFinder</h1>
          <p>Find Teams, Find People</p>
        </div>
        <div>
          <form
            className="flex bg-none mt-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const email = formData.get("email") as string;

              try {
                const res = await axios.post(
                  `${BASE_URL}/users/waitlist`,
                  { email }, // Data goes directly as second parameter
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );

                if (res.status === 200) {
                  setString("Added to the waitlist 🎉");
                }
              } catch (error) {
                console.log("in catch")
                if (axios.isAxiosError(error)) {
                  if (error.response?.status === 409) {
                    // Duplicate email
                    setString("You're already on the waitlist! 📧");
                  } else {
                    // Other errors
                    setString(
                      error.response?.data?.message ||
                        "Failed to add to the waitlist. Please try again. ☹️"
                    );
                  }
                } else {
                  setString("Something went wrong. Please try again. ☹️");
                }
                console.error("Failed to add to the waitlist", error);
              }
            }}
          >
            <Input
              id="email"
              name="email"
              placeholder="Email"
              className="w-full min-w-60"
              required
            />

            <Button
              type="submit"
              className="ml-2 bg-blue-400 hover:bg-blue-500 text-white"
            >
              Join Waitlist
            </Button>
          </form>
        </div>
      </motion.div>

      {string ? <p className="mt-2">{string}</p> : null}
    </div>
  );
}

export default LandingPage;
