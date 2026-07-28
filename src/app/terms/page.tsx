import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default function TermsPage() {
  redirect("/about#协议")
}
