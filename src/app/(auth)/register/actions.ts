'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  // Supabase Auth Signup
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  })

  // 에러 발생 시 redirect 대신 객체 반환
  if (error) {
    console.error("Signup Error:", error.message);
    return { error: error.message };
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
