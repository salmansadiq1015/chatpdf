"use client";
import React, { useEffect, useState } from "react";
import { FaRegUserCircle, FaStar, FaRegStar } from "react-icons/fa";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "react-toastify";
import { MdOutlineDeleteForever } from "react-icons/md";

export default function UserComment({ comment, role }) {
  const [usercomment, setUserComment] = useState([]);
  const [visibleComments, setVisibleComments] = useState(3);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-blue-500 " size="25" />
        ) : (
          <FaRegStar key={i} className="text-zinc-500" size="25" />
        )
      );
    }
    return stars;
  };

  const handleSeeMoreComment = () => {
    setVisibleComments((prevVisibleComments) => prevVisibleComments + 3);
  };

  useEffect(() => {
    if (comment?.length > 0) {
      setUserComment(comment?.slice(0, visibleComments));
    }
  }, [comment, visibleComments]);

  //   Delete Comment

  const deleteComment = async (id) => {
    try {
      await axios.delete(`/api/comment/${id}`);
      toast.success("Comment delete successfully!", {
        position: "top-center",
        theme: "dark",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full min-h-[60vh] flex flex-col gap-8 mt-8 ">
      <h1 className="text-2xl sm:text-4xl text-black font-bold">
        Hear From Our Clients
      </h1>
      <div className="comment grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 ">
        {usercomment?.map((c, index) => (
          <div
            key={index}
            className="w-full relative py-[1.5rem] px-6 rounded-sm shadow-sm hover:shadow-xl cursor-pointer border border-zinc-300"
          >
            {role === 1 && (
              <div
                className=" absolute top-1 right-2 py-1 px-1 rounded-md shadow-md cursor-pointer bg-red-500 "
                onClick={() => deleteComment(c.id)}
              >
                <MdOutlineDeleteForever size="23" color="white" />
              </div>
            )}
            <div className="flex items-center gap-3">
              <FaRegUserCircle size="40" className="text-blue-500" />
              <p className="font-medium">{c.email.slice(0, 12)}...</p>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <div className="flex items-center gap-1">
                <span className="text-lg font-medium">Rating:</span>
                {renderStars(c.rating)}
              </div>
              <p className="text-lg text-zinc-500">
                &quot;{c.text.slice(0, 220)}&quot;
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center">
        <Button
          className=" shadow hover:shadow-xl "
          style={{ display: comment?.length <= 3 ? "none" : "block" }}
          onClick={handleSeeMoreComment}
        >
          See more
        </Button>
      </div>
    </div>
  );
}
