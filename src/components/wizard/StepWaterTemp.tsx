"use client"
import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { waterTempSchema, WaterTempData } from "@/lib/schemas"
import * as Slider from "@radix-ui/react-slider"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function StepWaterTemp({ onNext, onBack, initialData }: { onNext: (data: WaterTempData) => void; onBack: () => void; initialData?: WaterTempData }) {
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

  const lastWaterTemp = useMemo<WaterTempData | undefined>(() => {
    if (initialData) return undefined; // we'll use initialData directly
    try {
      const raw = localStorage.getItem("lastWaterTemp")
      if (!raw) return undefined
      const parsed = JSON.parse(raw)
      // basic shape guard
      if (parsed && typeof parsed === 'object' && ('waterType' in parsed) && ('temperature' in parsed)) {
        return parsed as WaterTempData
      }
    } catch {}
    return undefined
  }, [initialData])

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<WaterTempData>({
    resolver: zodResolver(waterTempSchema),
    defaultValues: initialData ?? lastWaterTemp ?? { temperature: 25, waterType: "Mineral (recomendável)" },
  });
  const temp = watch("temperature");
  const selectedType = watch("waterType")

  // Clear conductivity when not Mineral, to avoid NaN lingering and validation noise
  useEffect(() => {
    if (selectedType !== "Mineral (recomendável)") {
      setValue("conductivity", undefined, { shouldValidate: false })
    }
  }, [selectedType])

  return (
    <form className="space-y-4 p-4" onSubmit={handleSubmit(onNext)}>
      <h1 className="text-xl font-bold">Água & Temperatura</h1>

      {/* Bloco de instruções abaixo do título */}
      <div className="space-y-2 text-sm text-neutral-700 text-justify">
         <p><span className="font-bold">A amostra de bebida, a água e o ambiente precisam estar na mesma temperatura</span>. Cheque com o termômetro a temperatura da água e da amostra e só inicie após essa equivalência (±0,5 °C).</p>
         <p><span className="font-bold">Não use bebidas e água resfriadas</span>. E sim em temperatura ambiente. Se necessário, espere estabilizar.</p>
         <p>Fora do ambiente laboratorial, dê preferência ao uso de <span className="font-bold">água mineral</span> por garantir uma maior estabilidade de composição.</p>
         <p>Se for usar <span className="font-bold">água de torneira</span>, certifique-se que é abastecida por companhia de Saneamento e deixe a torneira aberta por 5 segundos, antes da coleta.</p>
       </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tipo de água</label>
        <div className="grid grid-cols-1 gap-2">
          {["Mineral (recomendável)", "Potável/torneira", "Deionizada/Destilada (quando disponível)"].map((w) => (
            <label key={w} className="border rounded-lg p-3 text-sm">
              <input type="radio" value={w} {...register("waterType")} className="mr-2" />
              {w}
            </label>
          ))}
        </div>
        {errors.waterType && <p className="text-red-600 text-xs mt-1">{errors.waterType.message}</p>}
      </div>

      {selectedType === "Mineral (recomendável)" && (
        <div>
          <label className="block text-sm font-medium">Condutividade a 25 °C (µS/cm)</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="Insira aqui o valor"
            {...register("conductivity", { setValueAs: (v) => {
              const s = String(v).trim();
              if (!s) return undefined; // keep optional when empty
              const num = parseFlexibleDecimal(s);
              return isNaN(num) ? undefined : num; // avoid NaN persisting
            } })}
            className="mt-1 w-full border rounded-lg p-2"
          />
          <p className="text-xs text-neutral-600 mt-1">Informação disponível no rótulo do produto</p>
          {errors.conductivity && <p className="text-red-600 text-xs mt-1">{String(errors.conductivity.message)}</p>}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-center">Temperatura do ensaio (°C)</label>
        <div className="flex items-center justify-center gap-4 mt-2">
          <button type="button" aria-label="Diminuir temperatura" className="border rounded-full p-2" onClick={() => setValue("temperature", Math.max(20, (temp ?? 20) - 1))}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-center font-semibold text-[2rem] w-24">{temp}°C</span>
          <button type="button" aria-label="Aumentar temperatura" className="border rounded-full p-2" onClick={() => setValue("temperature", Math.min(50, (temp ?? 20) + 1))}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <Slider.Root value={[temp ?? 20]} min={20} max={50} step={1} onValueChange={(v) => setValue("temperature", v[0])} className="mt-3 relative flex items-center select-none touch-none h-5">
          <Slider.Track className="bg-neutral-200 relative grow rounded-full h-1">
            <Slider.Range className="absolute bg-brand h-1 rounded-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-5 h-5 bg-brand rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand" aria-label="Temperatura" />
        </Slider.Root>
        {errors.temperature && <p className="text-red-600 text-xs mt-1">{errors.temperature.message}</p>}
        {/* Removido texto final de instrução */}
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={onBack} className="border rounded-lg py-3 px-4 flex-1">Voltar</button>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-4 flex-1 disabled:bg-blue-300 disabled:cursor-not-allowed">Próximo</button>
      </div>
    </form>
  );
}