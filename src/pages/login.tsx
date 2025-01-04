"use client";

import React, { useContext } from "react";
import { Button, Input, Checkbox, Link } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { AuthContext } from '@/context/AuthContext';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { siteConfig } from '@/config/site';

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
}).required();

export default function LoginPage() {
  const [isVisible, setIsVisible] = React.useState(false);
  const { login } = useContext(AuthContext)
  const toggleVisibility = () => setIsVisible(!isVisible);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<{ username: string; password: string; }> = async (data) => {
    await login({
      username: data.username,
      password: data.password,
    });

    navigate(siteConfig.routes.panel)
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <p className="pb-4 text-left text-3xl font-semibold">
          Log In
          <span aria-label="emoji" className="ml-2" role="img">
            👋
          </span>
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
            isRequired
            label="Username"
            labelPlacement="outside"
            placeholder="Enter your username"
            type="text"
            variant="bordered"
            {...register("username", { required: true })}
            errorMessage={errors.username?.message}
            isInvalid={!!errors.username}
          />
                  <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Password"
            {...register("password", { required: true })}
            errorMessage={errors.password?.message}
            labelPlacement="outside"
            isInvalid={!!errors.password}
            name="password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
          />
          <div className="flex w-full items-center justify-between px-1 py-2">
            <Checkbox defaultSelected name="remember" size="sm">
              Remember me
            </Checkbox>
            <Link className="text-default-500" href="#" size="sm">
              Forgot password?
            </Link>
          </div>
          <Button className="w-full" color="primary" type="submit">
            Log In
          </Button>
        </form>
        <p className="text-center text-small">
          <Link href="#" size="sm">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
