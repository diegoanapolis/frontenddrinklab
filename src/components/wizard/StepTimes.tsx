"use client"
import React, { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { timesSchema, TimesData } from "@/lib/schemas"
import { useStopwatch, formatElapsed } from "@/hooks/useStopwatch"
import { Timer, ArrowLeft } from "lucide-react"
import Link from "next/link"

function computeStats(values: number[]) {
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n);
  const cv = (sd / mean) * 100;
  return { n, mean, sd, cv };
}

export default function StepTimes({ onNext, onBack, initialData }: { onNext: (data: TimesData) => void; onBack: () => void; initialData?: TimesData }) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<TimesData>({
    resolver: zodResolver(timesSchema),
    defaultValues: initialData ?? { waterTimes: [], sampleTimes: [] },
  });
  const waterTimes = watch("waterTimes") || [];
  const sampleTimes = watch("sampleTimes") || [];

  const wStats = useMemo(() => (waterTimes.length ? computeStats(waterTimes) : null), [waterTimes]);
  const sStats = useMemo(() => (sampleTimes.length ? computeStats(sampleTimes) : null), [sampleTimes]);

  const sw = useStopwatch();
  const [showStopwatch, setShowStopwatch] = useState(false)
  const [lastElapsedMs, setLastElapsedMs] = useState<number | null>(null)

  // helper to accept both "," and "." as decimal, giving precedence to "," when both exist
  const parseFlexibleDecimal = (input: string): number => {
    if (typeof input !== "string") input = String(input ?? "")
    const s = input.trim()
    if (!s) return NaN
    const hasComma = s.includes(',')
    const hasDot = s.includes('.')
    let normalized = s
    if (hasComma && hasDot) {
      normalized = s.replace(/\./g, '').replace(',', '.')
    } else if (hasComma) {
      normalized = s.replace(',', '.')
    }
    const n = Number(normalized)
    return isNaN(n) ? NaN : n
  }

  const addEntry = (key: "waterTimes" | "sampleTimes") => {
    const v = parseFlexibleDecimal(String(prompt("Informe tempo (s)") || ""));
    if (!isNaN(v)) setValue(key, [...(watch(key) || []), v]);
  };

  const editEntry = (key: "waterTimes" | "sampleTimes", idx: number) => {
    const cur = (watch(key) || [])[idx]
    const v = parseFlexibleDecimal(String(prompt("Editar tempo (s)", String(cur)) || ""));
    if (!isNaN(v)) {
      const arr = [...(watch(key) || [])]
      arr[idx] = v
      setValue(key, arr)
    }
  }

  const removeEntry = (key: "waterTimes" | "sampleTimes", idx: number) => {
    const arr = [...(watch(key) || [])]
    arr.splice(idx, 1)
    setValue(key, arr)
  }

  const startFull = () => {
    setShowStopwatch(true)
    // Do not auto-start; just show overlay and reset to placeholder
    sw.reset()
    setLastElapsedMs(null)
  }
  const stopFull = () => {
    sw.stop()
    setLastElapsedMs(sw.elapsed)
  }
  const resetFull = () => {
    sw.reset()
    setLastElapsedMs(null)
  }
  const confirmAssign = (target: "waterTimes" | "sampleTimes") => {
    if (lastElapsedMs == null) return
    const seconds = Math.round(lastElapsedMs / 100) / 10 // one decimal
    setValue(target, [...(watch(target) || []), seconds])
    // Close overlay and return to list view showing the new entry
    setShowStopwatch(false)
    resetFull()
  }

  return (
    <form className="space-y-4 p-4" onSubmit={handleSubmit(onNext)}>
      <h1 className="text-xl font-bold">Tempos de escoamento (10→15 mL)</h1>
      <div className="text-sm text-neutral-700 text-justify space-y-2">
        <p>
          <span className="font-bold">Etapa mais sensível da metodologia</span>. Não deixe de consultar a <Link href="/metodologia" className="underline">Metodologia</Link> em caso de dúvida.
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>
            <span className="font-bold">Use seringa de 20 mL limpa e seca</span>, livre de detergente, ou a enxágue com o líquido analisado.
          </li>
          <li>
            Deixe o cronômetro em posição de disparar em sua mão, <span className="font-bold">preencha a seringa (sem êmbulo) com o líquido analisado</span>, por cima, até próximo à marcação de 20 mL e mantenha os seus olhos na altura do menisco (parte inferior da curva que define o nível do líquido).
          </li>
          <li>
            Quando o menisco <span className="font-bold">encostar na graduação 15 mL</span>, dispare o cronômetro imediatamente. Continue acompanhando o menisco e interrompa o menisco imediatamente quando o menisco <span className="font-bold">tocar a marcação de 10 mL</span>.
          </li>
        </ol>
        <p>
          <span className="font-bold">Faça pelo menos dois escoamento (replicata)</span>. Se o recipiente coletor estiver limpo e seco, você poderá reaproveitar o líquido.
        </p>
      </div>
      {/* Show validation messages when not enough replicas */}
      {(errors?.waterTimes || errors?.sampleTimes) && (
        <p className="text-red-600 text-sm">{errors?.waterTimes?.message || errors?.sampleTimes?.message as string}</p>
      )}
      <p className="text-sm text-neutral-600">Use o mesmo bico/seringa; não bompeie o êmbolo. Observe o menisco à altura dos olhos. Se perder o acionamento, complete o volume e refaça.</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="font-medium" style={{ color: "var(--color-label)" }}>Água</div>
          <div className="flex flex-wrap gap-2">
            {waterTimes.map((m, idx) => (
              <span key={idx} className="px-3 py-2 border rounded-lg text-sm">
                {m.toFixed(1)} s
                <button type="button" className="ml-2 text-xs underline" onClick={() => editEntry("waterTimes", idx)}>Editar</button>
                <button type="button" className="ml-2 text-xs underline" onClick={() => removeEntry("waterTimes", idx)}>Remover</button>
              </span>
            ))}
            <button type="button" onClick={() => addEntry("waterTimes")} className="border rounded-lg px-3 py-2 text-sm">+ réplica</button>
          </div>
          {wStats && (
            <p className="text-xs mt-2">média {wStats.mean.toFixed(1)} s • CV {wStats.cv.toFixed(1)}%</p>
          )}
          {wStats && wStats.cv > 3 && (
            <p className="text-red-600 text-xs mt-1">CV de tempo alto (&gt;3%). Tente repetir a medição.</p>
          )}
        </div>

        <div>
          <div className="font-medium" style={{ color: "var(--color-label)" }}>Amostra</div>
          <div className="flex flex-wrap gap-2">
            {sampleTimes.map((m, idx) => (
              <span key={idx} className="px-3 py-2 border rounded-lg text-sm">
                {m.toFixed(1)} s
                <button type="button" className="ml-2 text-xs underline" onClick={() => editEntry("sampleTimes", idx)}>Editar</button>
                <button type="button" className="ml-2 text-xs underline" onClick={() => removeEntry("sampleTimes", idx)}>Remover</button>
              </span>
            ))}
            <button type="button" onClick={() => addEntry("sampleTimes")} className="border rounded-lg px-3 py-2 text-sm">+ réplica</button>
          </div>
          {sStats && (
            <p className="text-xs mt-2">média {sStats.mean.toFixed(1)} s • CV {sStats.cv.toFixed(1)}%</p>
          )}
          {sStats && sStats.cv > 3 && (
            <p className="text-red-600 text-xs mt-1">CV de tempo alto (&gt;3%). Tente repetir a medição.</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="font-medium" style={{ color: "var(--color-label)" }}>Cronômetro embutido</div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={startFull}
            className="mt-2 bg-white border-2 border-brand text-brand rounded-full px-6 py-3 flex items-center gap-2 font-bold shadow-sm"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}
          >
            <Timer className="w-8 h-8" aria-hidden="true" />
            <span className="text-lg">Usar cronômetro</span>
          </button>
        </div>
      </div>

      {showStopwatch && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Top inline text */}
          <div className="px-4 pt-4 text-sm text-neutral-600 text-center">Não se preocupe, após finalizar com Stop você poderá indicar se é tempo da Amostra ou da Água de Referência.</div>
          {/* Back button placed below the top text */}
          <div className="px-4 pb-2 flex justify-start">
            <button
              type="button"
              onClick={() => setShowStopwatch(false)}
              className="inline-flex items-center gap-1 text-brand px-1 py-1"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.75} aria-hidden="true" />
              <span className="text-sm font-medium">Voltar</span>
            </button>
          </div>
          {/* Center: giant circular Start/Stop button with time inside */}
          <div className="flex-1 flex items-center justify-center">
            {(() => {
              const initialPlaceholder = "00.0" // unified seconds format placeholder
              const displayTime = sw.running || (sw.elapsed && sw.elapsed > 0) ? formatElapsed(sw.elapsed) : initialPlaceholder
              const baseBtn = "rounded-full flex flex-col items-center justify-center text-white shadow-md"
              const sizeBtn = "w-[85vw] h-[85vw] max-w-[560px] max-h-[560px]"
              const colorBtn = sw.running ? "bg-red-600" : "bg-blue-600 hover:bg-blue-700"
              return (
                <button
                  type="button"
                  onClick={() => (sw.running ? stopFull() : sw.start())}
                  className={`${baseBtn} ${sizeBtn} ${colorBtn}`}
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <div className="text-5xl font-mono">{displayTime}</div>
                  <div className="mt-2 text-5xl">{sw.running ? "Stop" : "Start"}</div>
                </button>
              )
            })()}
          </div>
          {/* Bottom controls: Reset, Assign to Water, Assign to Sample */}
          <div className="p-4 grid grid-cols-3 gap-2">
            <button type="button" onClick={resetFull} className="border rounded-lg py-3 px-4">Reset</button>
            <button
              type="button"
              disabled={lastElapsedMs == null || sw.running}
              onClick={() => confirmAssign("waterTimes")}
              className="border rounded-lg py-3 px-4 disabled:opacity-50"
            >
              Atribuir à Água
            </button>
            <button
              type="button"
              disabled={lastElapsedMs == null || sw.running}
              onClick={() => confirmAssign("sampleTimes")}
              className="border rounded-lg py-3 px-4 disabled:opacity-50"
            >
              Atribuir à Amostra
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button type="button" onClick={onBack} className="border rounded-lg py-3 px-4 flex-1">Voltar</button>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-4 flex-1 disabled:bg-blue-300 disabled:cursor-not-allowed">Próximo</button>
      </div>
    </form>
  );
}