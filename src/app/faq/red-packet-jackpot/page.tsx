import { FaqPageFrame } from "@/components/faq-page-frame"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buildFaqMetadata } from "@/lib/faq"

export async function generateMetadata() {
  return buildFaqMetadata("红包与聚宝盆", "查看风笺红包和聚宝盆的触发方式、限制条件、中奖规则和当前站点数值。")
}

export default async function RedPacketJackpotFaqPage() {
  return (
    <FaqPageFrame currentPath="/faq/red-packet-jackpot" title="红包与聚宝盆" description="红包与聚宝盆功能已关闭。">
      <Card>
        <CardHeader>
          <CardTitle>功能已关闭</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            红包与聚宝盆功能已关闭，相关页面内容不再展示。
          </p>
        </CardContent>
      </Card>
    </FaqPageFrame>
  )
}
