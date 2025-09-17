import { PrivacySettings } from "@/components/gdpr/privacy-settings"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <PrivacySettings />
      </div>
    </div>
  )
}
