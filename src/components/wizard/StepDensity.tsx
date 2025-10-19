"use client"
import React, { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { densitySchema, DensityData } from "@/lib/schemas"

function computeStats(values: number[]) {
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n);
  const cv = (sd / mean) * 100;
  return { n, mean, sd, cv };
}

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

export default function StepDensity({ onNext, onBack, initialData }: { onNext: (data: DensityData) => void; onBack: () => void; initialData?: DensityData }) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<DensityData>({
    resolver: zodResolver(densitySchema),
    defaultValues: initialData ?? { waterMasses: [], sampleMasses: [] },
  });
  const waterMasses = watch("waterMasses") || [];
  const sampleMasses = watch("sampleMasses") || [];
  const wStats = useMemo(() => (waterMasses.length ? computeStats(waterMasses) : null), [waterMasses]);
  const sStats = useMemo(() => (sampleMasses.length ? computeStats(sampleMasses) : null), [sampleMasses]);

  const addEntry = (key: "waterMasses" | "sampleMasses") => {
    const v = parseFlexibleDecimal(String(prompt("Informe massa (g)") || ""));
    if (!isNaN(v)) setValue(key, [...(watch(key) || []), v]);
  };

  const editEntry = (key: "waterMasses" | "sampleMasses", idx: number) => {
    const cur = (watch(key) || [])[idx]
    const v = parseFlexibleDecimal(String(prompt("Editar massa (g)", String(cur)) || ""));
    if (!isNaN(v)) {
      const arr = [...(watch(key) || [])]
      arr[idx] = v
      setValue(key, arr)
    }
  }

  const removeEntry = (key: "waterMasses" | "sampleMasses", idx: number) => {
    const arr = [...(watch(key) || [])]
    arr.splice(idx, 1)
    setValue(key, arr)
  }

  return (
    <form className="space-y-4 p-4" onSubmit={handleSubmit(onNext)}>
      <h1 className="text-xl font-bold">Aferição de massa (densidade)</h1>

      {/* Instruções iniciais justificados */}
      <div className="space-y-2 text-sm text-neutral-700 text-justify">
        <p>
          Use balança que mede grama com <span className="font-bold">pelo menos uma casa decimal (0,1 g)</span>.
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>
            <span className="font-bold">Tare a balança</span> (zere o peso) com a seringa (limpa e seca) sobre ela.
          </li>
          <li>
            Em seguida, <span className="font-bold">pese exatamente o mesmo volume da Amostra e da Água</span>.
          </li>
          <li>
            Sugestão: com a seringa limpa, seca e livre de detergentes, inicie pela Amostra. Depois enxágue bem o interior com Água e só depois aspire exatamente o mesmo volume de Água para aferição de massa.
          </li>
          <li>
            <span className="font-bold">Cuidado</span>: em todas as pesagens, a seringa precisa estar seca pelo lado de fora, inclusive na região exterior do êmbulo.
          </li>
        </ol>
        <p>
          Obs.: Aqui apenas uma pesagem cuidadosa de cada é suficiente, mas você pode incluir replicatas (se desejar).
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="font-medium" style={{ color: "var(--color-label)" }}>Água</div>
          <div className="flex flex-wrap gap-2">
            {waterMasses.map((m, idx) => (
              <span key={idx} className="px-3 py-2 border rounded-lg text-sm">
                {m.toFixed(1)} g
                <button type="button" className="ml-2 text-xs underline" onClick={() => editEntry("waterMasses", idx)}>Editar</button>
                <button type="button" className="ml-2 text-xs underline" onClick={() => removeEntry("waterMasses", idx)}>Remover</button>
              </span>
            ))}
            <button type="button" onClick={() => addEntry("waterMasses")} className="border rounded-lg px-3 py-2 text-sm">+ réplica</button>
          </div>
          {wStats && (
            <p className="text-xs mt-2">média {wStats.mean.toFixed(1)} g • CV {wStats.cv.toFixed(1)}%</p>
          )}
        </div>

        <div>
          <div className="font-medium" style={{ color: "var(--color-label)" }}>Amostra</div>
          <div className="flex flex-wrap gap-2">
            {sampleMasses.map((m, idx) => (
              <span key={idx} className="px-3 py-2 border rounded-lg text-sm">
                {m.toFixed(1)} g
                <button type="button" className="ml-2 text-xs underline" onClick={() => editEntry("sampleMasses", idx)}>Editar</button>
                <button type="button" className="ml-2 text-xs underline" onClick={() => removeEntry("sampleMasses", idx)}>Remover</button>
              </span>
            ))}
            <button type="button" onClick={() => addEntry("sampleMasses")} className="border rounded-lg px-3 py-2 text-sm">+ réplica</button>
          </div>
          {sStats && (
            <p className="text-xs mt-2">média {sStats.mean.toFixed(1)} g • CV {sStats.cv.toFixed(1)}%</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button type="button" onClick={onBack} className="border rounded-lg py-3 px-4 flex-1">Voltar</button>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-4 flex-1 disabled:bg-blue-300 disabled:cursor-not-allowed">Próximo</button>
      </div>
    </form>
  );
}