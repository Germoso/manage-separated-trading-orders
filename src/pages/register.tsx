"use client";

import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { useForm, SubmitHandler } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { registerUser } from '@/api/authServices';

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
  repeatPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required')
}).required();

export default function RegisterPage() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<{ username: string; password: string; repeatPassword: string }> = async (data) => {
    const result = await registerUser({
      password: data.password,
      username: data.username,
      passwordRepeat: data.repeatPassword
    });

    alert('User registered successfully');

    return result;
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <p className="pb-4 text-left text-3xl font-semibold">
          Sign Up
          <span aria-label="emoji" className="ml-2" role="img">
            👋
          </span>
        </p>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
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
          {/* <Input
            isRequired
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
          /> */}
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
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleConfirmVisibility}>
                {isConfirmVisible ? (
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
            label="Confirm Password"
            errorMessage={errors.repeatPassword?.message}
            isInvalid={!!errors.repeatPassword}
            labelPlacement="outside"
            placeholder="Confirm your password"
            type={isConfirmVisible ? "text" : "password"}
            variant="bordered"
            {...register("repeatPassword", { required: true })}
          />
          {/* <Checkbox isRequired className="py-4" size="sm">
            I agree with the&nbsp;
            <Link href="#" size="sm">
              Terms
            </Link>
            &nbsp; and&nbsp;
            <Link href="#" size="sm">
              Privacy Policy
            </Link>
          </Checkbox> */}
          <Button color="primary" type="submit">
            Sign Up
          </Button>
        </form>
        <p className="text-center text-small">
          <Link href="#" size="sm">
            Already have an account? Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
