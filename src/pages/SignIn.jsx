import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Cookies from "universal-cookie";

function SignIn() {
  const cookies = new Cookies();
  const schema = yup.object().shape({
    username: yup
      .string()
      .required("Username is required")
      .matches(/^[a-zA-Z0-9_.@$]+/, "Invalid Username"),
    name: yup.string().required("Name is required"),
    // password: yup.string().required().minLength(8),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    const { username, name } = formData;
    // console.log(username, name);
    const response = await fetch("http://localhost:7000/auth/registerUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        name,
        image,
      }),
    });

    if (!response.ok) {
      throw new Error("Error saving user");
    }
    const results = await response.json();

    const expires = new Date();
    expires.setDate(expires.getDate() + 1);
    cookies.set("token", results.token, {
      expires,
    });
    cookies.set("username", results.username, {
      expires,
    });
    cookies.set("name", results.name, {
      expires,
    });
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" {...register("username")} />
          {errors.username && (
            <span className="text-xs text-red-600">
              {errors.username.message}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="name">Name</label>
          <input type="text" {...register("name")} />
        </div>
      </form>
    </div>
  );
}

export default SignIn;
