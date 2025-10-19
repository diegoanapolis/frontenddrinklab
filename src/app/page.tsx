"use client"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Beaker, LineChart, BookOpen, Info } from "lucide-react"

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      const seen = localStorage.getItem("onboardingSeen")
      setShowOnboarding(!seen)
    } catch {
      setShowOnboarding(true)
    }
  }, [])

  const completeOnboarding = () => {
    try { localStorage.setItem("onboardingSeen", "1") } catch {}
    setShowOnboarding(false)
  }

  const cards = [
    {
      title: "Objetivo",
      text: "Ferramenta preventiva para triagem de bebidas destiladas. Não confirma adulteração.",
    },
    {
      title: "Medições",
      text: "Você medirá temperatura, densidade (massas) e tempos de escoamento com um funil padronizado.",
    },
    {
      title: "Precisão",
      text: "Evite CVs altos: massas água/amostra <2%, tempos água/amostra <3%.",
    },
    {
      title: "Resultados",
      text: "Mostramos indicadores relativos, aderência ao binário e triagem de risco. Use com bom senso.",
    },
  ]

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Triagem de composição de destilados</h1>
      <div className="space-y-2">
        <p className="text-sm text-neutral-700 text-justify">Esta ferramenta aplica-se apenas às bebidas destiladas puras (‘secas’) <span className="font-bold">listadas em <Link href="/medir" className="underline">Medir</Link></span>. Estima composição em água, etanol e metanol (se presentes acima de 5%).</p>
        <p className="text-sm text-neutral-700 text-justify"><span className="font-bold">Ferramenta preventiva de triagem</span>, auxiliando na proteção da saúde pública.</p>
        <p className="text-sm text-neutral-700 text-justify"><span className="font-bold">Não é exame confirmatório</span>, mas sim estimativo, e não substitui exames laboratoriais oficiais.</p>
        <p className="text-sm text-neutral-700 text-justify">Em casos suspeitos, <span className="font-bold">NÃO CONSUMA a bebida</span>, mesmo com resultados de triagem normais.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Link href="/medir" className="border rounded-lg p-4 text-center flex flex-col items-center gap-1">
          <Beaker className="w-8 h-8 text-brand" aria-hidden="true" />
          <span>Medir</span>
        </Link>
        <Link href="/resultados" className="border rounded-lg p-4 text-center flex flex-col items-center gap-1">
          <LineChart className="w-8 h-8 text-brand" aria-hidden="true" />
          <span>Resultados</span>
        </Link>
        <Link href="/metodologia" className="border rounded-lg p-4 text-center flex flex-col items-center gap-1">
          <BookOpen className="w-8 h-8 text-brand" aria-hidden="true" />
          <span>Metodologia</span>
        </Link>
        <Link href="/sobre" className="border rounded-lg p-4 text-center flex flex-col items-center gap-1">
          <Info className="w-8 h-8 text-brand" aria-hidden="true" />
          <span>Sobre</span>
        </Link>
      </div>

      {showOnboarding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-end md:items-center md:justify-center">
          <div className="bg-white rounded-t-2xl md:rounded-2xl p-4 w-full md:max-w-md">
            <h2 className="text-lg font-semibold mb-2">Boas-vindas</h2>
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex gap-3">
                {cards.map((c, i) => (
                  <div key={i} className="min-w-[75%] border rounded-lg p-3">
                    <div className="text-sm font-medium">{c.title}</div>
                    <div className="text-sm text-neutral-700 mt-1">{c.text}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={completeOnboarding} className="border rounded-lg py-2 px-4 flex-1">Entendi</button>
              <button
                onClick={() => { completeOnboarding(); router.push("/medir") }}
                className="bg-black text-white rounded-lg py-2 px-4 flex-1"
              >Começar</button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-2 mt-2">
        <p className="text-sm text-neutral-700 text-justify">Para o exame, <span className="font-bold">são necessários</span>: seringa de 20 mL (de farmácia); balança com pelo menos uma casa decimal (0,1 g); e termômetro. Leia a <Link href="/medir" className="underline">Metodologia</Link> antes de iniciar o exame.</p>
        <p className="text-sm text-red-600 font-bold text-justify">Avisos importantes:</p>
        <ul className="list-disc ml-5 text-sm text-red-600 text-justify space-y-1">
          <li>Em caso de suspeita de contaminação por metanol, busque serviço de saúde imediatamente e ligue para o Disque-Intoxicação 0800 722 6001;</li>
          <li>Medidas preventivas: compre de fornecedores confiáveis; confira selo fiscal nos destilados impressos pela Casa da Moeda; examine a integridade da embalagem; peça para ver a garrafa antes de pedir a dose; desconfie de preços muito abaixo do usual.</li>
          <li>Em casos suspeitos, denuncie. Acione a Vigilância Sanitária local, Polícia Civil (197), PROCON e, quando couber, o MAPA.</li>
        </ul>
      </div>
    </div>
  )
}
