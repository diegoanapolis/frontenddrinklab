"use client"
import React from "react"
import { BEVERAGE_TYPES } from "@/lib/constants"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, ProfileData } from "@/lib/schemas"
import Link from "next/link"

export default function StepProfile({ onNext, initialData }: { onNext: (data: ProfileData) => void; initialData?: ProfileData }) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData ?? { beverageType: undefined as any },
  });

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

  return (
    <form className="space-y-4 p-4" onSubmit={handleSubmit(onNext)}>
      <h1 className="text-xl font-bold">Perfil da amostra</h1>
      {/* Removido aviso antigo */}

      {/* Texto explicativo principal com justificação */}
      
      <div>
        <label className="block text-sm font-medium mb-2">Tipo de bebida da amostra</label>
        <div className="grid grid-cols-2 gap-2">
          {BEVERAGE_TYPES.map((b) => (
            <label key={b} className="border rounded-lg p-3 text-sm">
              <input type="radio" value={b} {...register("beverageType")} className="mr-2" />
              <span className={b === "Etanol comercial*" ? "font-bold" : undefined}>{b}</span>
            </label>
          ))}
        </div>
        {errors.beverageType && (
          <p className="text-red-600 text-xs mt-1">{errors.beverageType.message}</p>
        )}
      </div>

      {/* Parágrafo explicativo sobre o etanol comercial (check) com início em negrito */}
      <p className="text-sm text-neutral-700 mt-2 text-justify">* <span className="font-bold">Etanol comercial lacrado pode ser utilizado como check</span> para verificação se os resultados obtidos com seus instrumentos estão coerentes. Ação recomendada posteriormente a uma triagem que acuse possível presença de metanol.</p>

      {/* Texto de restrições com início em negrito e justificação */}
      <p className="text-sm text-neutral-700 text-justify">
        <span className="font-bold">Não se aplica</span> para licores; cremes; fermentados (vinho, cerveja, sidra, hidromel); destilados saborizados; bebidas adoçadas (licores, anisados, bebidas mistas, caipirinhas prontas); Bebidas turvas, com polpas, emulsões, óleos ou corantes densos; misturas caseiras não homogêneas (coquetéis).
      </p>

      <div>
        <label className="block text-sm font-medium">Teor do rótulo (% v/v) ou GL para check</label>
        <input
          type="text"
          inputMode="decimal"
          placeholder="Opcional"
          {...register("labelAbv", { setValueAs: (v) => {
            const s = String(v ?? "").trim();
            if (!s) return undefined; // keep optional when empty
            const num = parseFlexibleDecimal(s);
            return isNaN(num) ? undefined : num; // avoid NaN persisting
          } })}
          className="mt-1 w-full border rounded-lg p-2"
        />
        <p className="text-xs text-neutral-600 mt-1">Preencher teor % sempre que disponível no rótulo</p>
        {errors.labelAbv && <p className="text-red-600 text-xs mt-1">{errors.labelAbv.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Fabricante e/ou marca (opcional)</label>
        <input type="text" maxLength={60} {...register("brand")} className="mt-1 w-full border rounded-lg p-2" />
        {errors.brand && <p className="text-red-600 text-xs mt-1">{errors.brand.message}</p>}
      </div>

      {/* Aviso metodológico antes do botão Próximo */}
      <p className="text-sm text-neutral-700">Consulte materiais necessários e o procedimento em <Link href="/metodologia" className="underline">Metodologia</Link> antes de iniciar.</p>
      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 disabled:bg-blue-300 disabled:cursor-not-allowed">Próximo</button>
      </div>
    </form>
  );
}