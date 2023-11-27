"use client";
import { useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { BiSolidStar } from "react-icons/bi";
import { FiStar } from "react-icons/fi";

const Star = ({ selected, onClick }) => {
  return selected ? (
    <BiSolidStar onClick={onClick} size={26} color="red" />
  ) : (
    <FiStar onClick={onClick} size={26} color="red" />
  );
};

export default function Comment({ userId, userEmail }) {
  const [text, setText] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stars, setStars] = useState(0);

  // ----------Rating----------->
  const handleStarClick = (starCount) => {
    setStars(starCount);
  };

  const renderStars = () => {
    const starArray = [];
    for (let i = 1; i <= 5; i++) {
      starArray.push(
        <Star
          key={i}
          selected={i <= stars}
          onClick={() => handleStarClick(i)}
        />
      );
    }
    return starArray;
  };

  // ----------------Post Comment---------->
  const handleCommentSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (userId || userEmail) {
        const response = await axios.post("/api/comment", {
          userId,
          text,
          email: userEmail,
          rating: stars,
        });
        if (response.data.success) {
          setText("");
          setStars(0);
          toast.success("Comment submitted successfully!", {
            position: "top-center",
            theme: "dark",
          });
          setIsShow(false);
        } else {
          setError("Failed to submit comment");
        }
      } else {
        toast.error("Login & share you review!", {
          position: "top-center",
          theme: "dark",
        });
      }
    } catch (error) {
      setError("Error submitting comment");
      console.error("Error submitting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {isShow && (
        <div
          className="w-[20rem] h-[11rem] flex flex-col gap-3 rounded-md p-2 mb-[3rem] mr-6 bg-white border
         border-zinc-400"
        >
          <h3 className="text-xl font-semibold text-black">
            Ratings and reviews
          </h3>
          <div className="star-rating flex items-center gap-2">
            {renderStars()}
          </div>
          <textarea
            className="w-full rounded-md py-2 px-2"
            placeholder="Write your thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              height: "4.5rem",
              border: "2px solid #999",
              resize: "none",
            }}
          ></textarea>

          <Button onClick={handleCommentSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit "}{" "}
            {!isLoading && <ArrowRight className="w-6 h-5" />}
          </Button>

          {error && <p className="text-red-500">{error}</p>}
        </div>
      )}
      <div
        onClick={() => setIsShow(!isShow)}
        className="fixed bottom-3 right-3 z-50 bg-blue-500 text-white py-2 px-2 rounded-lg shadow-lg"
      >
        {!isShow ? (
          <FaRegCommentDots size="28" className="animate-pulse inline-block" />
        ) : (
          <IoClose size="28" className="animate-pulse inline-block" />
        )}
      </div>
    </div>
  );
}
