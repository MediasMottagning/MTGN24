"use client"; //  idk what this does but makes usestate work lol
import React, { useState } from "react";
import BlogPost from "../components/BlogPost";

const blogg = () => {
  return (
    <div>
      <h1>Hello This is the blog page</h1>
      <BlogPost />
    </div>
  );
};

export default blogg;
