"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import { HeartHandshake, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { signIn } from "next-auth/react"
import Link from "next/link"

const loginSchema = z.object({
  username: z.string().min(6, {
    message: "username должен быть не меньше 6 символов.",
  }),
  password: z.string().min(6, {
    message: "Пароль должен быть не меньше 6 символов.",
  }),
})

const regSchema = z.object({
  username: z.string().min(6, {
    message: "username должен быть не меньше 6 символов.",
  }),
  password: z.string().min(6, {
    message: "Пароль должен быть не меньше 6 символов.",
  }),
  confirmPassword: z.string({
    required_error: 'Пожалуйста, повторите пароль',
  }).min(6, {
    message: "Пароль должен быть не меньше 6 символов.",
  }),
  email: z.string().min(6, {
    message: "Почта должена быть не меньше 6 символов.",
  }).email("Пожалуйста, введите корректную почту"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"], // path of error
}).superRefine(({ password }, checkPassComplexity) => {
  const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
  const containsLowercase = (ch: string) => /[a-z]/.test(ch);
  const containsSpecialChar = (ch: string) =>
    /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
  let countOfUpperCase = 0,
    countOfLowerCase = 0,
    countOfNumbers = 0,
    countOfSpecialChar = 0;
  for (let i = 0; i < password.length; i++) {
    let ch = password.charAt(i);
    if (!isNaN(+ch)) countOfNumbers++;
    else if (containsUppercase(ch)) countOfUpperCase++;
    else if (containsLowercase(ch)) countOfLowerCase++;
    else if (containsSpecialChar(ch)) countOfSpecialChar++;
  }
  if (
    countOfLowerCase < 1 ||
    countOfUpperCase < 1 ||
    countOfSpecialChar < 1 ||
    countOfNumbers < 1
  ) {
    checkPassComplexity.addIssue({
      code: "custom",
      message: "Пароль не достаточно сложный",
    });
  }
})



export default function AuthModal() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:1337";
  const path = "/api/connect/discord";
  const url = new URL(backendUrl + path);
  const [type, setType] = useState(0);

  function login(){
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        username: "",
        password: "",
      },
    })
    
    function onSubmit(data: z.infer<typeof loginSchema>) {
      // const result = (await registerAction(values)) as StrapiAuthActionResponse;
      // if (result.ok) {
      //   renderMessage("Logged in successfully", "success");
      //   setUser(result.data as StrapiAuthResponse)
      //   router.push("/dashboard");
      // } else result.error && renderMessage(result.error.message, "error");
    }
  
    return (
      <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Авторизация</h1>
              <p className="text-sm text-muted-foreground flex gap-1 justify-center items-center">Добро пожаловать! Рады вас видеть <HeartHandshake height={18} width={18}/></p>
            </div>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when youre done.
            </DialogDescription> */}
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 grid gap-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Логин или email</FormLabel> */}
                    <Input type="email" placeholder="Введите логин или почту" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Пароль</FormLabel> */}
                    <Input placeholder="Введите пароль" type="password" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Войти</Button>
              <span className="flex gap-2 text-sm items-center">Нет аккаунта? <Badge className="cursor-pointer" onClick={() => setType(1)}>Зарегистироваться</Badge></span>
  
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Или войдите через</span>
                </div>
              </div>
  
              <Link href={url.href} className="w-full">
                <Button type="button" variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" /> Discord
                </Button>
              </Link>
            </form>
          </Form>
        </DialogContent>
    )
  }

  function register(){
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const form = useForm<z.infer<typeof regSchema>>({
        resolver: zodResolver(regSchema),
        defaultValues: {
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        },
      })
      
      function onSubmit(data: z.infer<typeof regSchema>) {
        toast({
          title: "You submitted the following values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
          ),
        })
      }
    
      return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Регистрация</h1>
                <p className="text-sm text-muted-foreground flex gap-1 justify-center items-center">Привет! Давайте знакомиться, я idenstore <HeartHandshake height={18} width={18}/></p>
              </div>
              {/* <DialogDescription>
                Make changes to your profile here. Click save when youre done.
              </DialogDescription> */}
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 grid gap-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Логин или email</FormLabel> */}
                      <Input type="username" placeholder="Введите логин" {...field} />
                      <FormMessage className="mt-0"/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Логин или email</FormLabel> */}
                      <Input type="email" placeholder="Введите почту" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Пароль</FormLabel> */}
                      <Input placeholder="Введите пароль" type="password" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Пароль</FormLabel> */}
                      <Input placeholder="Повторите пароль" type="password" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Зарегистироваться</Button>
                <span className="flex gap-2 text-sm items-center">Есть аккаунт? <Badge onClick={() => setType(0)} className="cursor-pointer">Войти</Badge></span>

              </form>
            </Form>
          </DialogContent>
      )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Вход и регистрация</Button>
      </DialogTrigger>
      {type == 0? login() : register() }
    </Dialog>
  )
}
