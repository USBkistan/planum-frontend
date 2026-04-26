"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { userChangeSchema } from "@/app/schemas/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getMeRequest, updatePasswordRequest } from "@/services/user";

interface User {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(userChangeSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(payload: z.infer<typeof userChangeSchema>) {
    if (payload.password && payload.password != "") {
      updatePasswordRequest(payload.password);
    }
  }

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      const data = await getMeRequest();
      if (!isCancelled) {
        setUser(data!);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="felx-row flex justify-between">
      <Card className="max-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {user?.display_name} ({user?.email})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Новый пароль</FieldLabel>
                    <Input aria-invalid={fieldState.invalid} placeholder="********" {...field} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Button>Обновить</Button>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      <Card className="max-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Группа</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Новый пароль</FieldLabel>
                    <Input aria-invalid={fieldState.invalid} placeholder="********" {...field} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Button>Обновить</Button>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
