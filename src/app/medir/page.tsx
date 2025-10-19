"use client"
import React, { useEffect, useState } from "react"
import StepProfile from "@/components/wizard/StepProfile"
import StepWaterTemp from "@/components/wizard/StepWaterTemp"
import StepDensity from "@/components/wizard/StepDensity"
import StepTimes from "@/components/wizard/StepTimes"
import StepReviewCalculate, { WizardData } from "@/components/wizard/StepReviewCalculate"
import { useRouter } from "next/navigation"

export default function MedirPage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>({})
  const router = useRouter()

  useEffect(() => {
    try {
      const rawData = localStorage.getItem("wizardData")
      const rawStep = localStorage.getItem("wizardStep")
      if (rawData) setData(JSON.parse(rawData))
      if (rawStep) setStep(Number(rawStep) || 1)
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem("wizardData", JSON.stringify(data)) } catch {}
  }, [data])

  useEffect(() => {
    try { localStorage.setItem("wizardStep", String(step)) } catch {}
  }, [step])

  const next = () => setStep((s) => s + 1)
  const back = () => setStep((s) => Math.max(1, s - 1))

  const handleCalculate = () => {
    try {
      const worker = new Worker("/workers/calcWorker.js")
      worker.onmessage = (e) => {
        const payload = e.data
        // Preserve last water reference for convenience in new measurements
        try {
          if (data.waterTemp) localStorage.setItem("lastWaterTemp", JSON.stringify(data.waterTemp))
        } catch {}
        if (payload && payload.ok) {
          try {
            localStorage.setItem("lastResult", JSON.stringify(payload.result))
          } catch {}
          // Clear wizard cache only after a successful calculation
          try {
            localStorage.removeItem("wizardData")
            localStorage.removeItem("wizardStep")
          } catch {}
          router.push("/resultados")
        } else {
          router.push("/resultados")
        }
        worker.terminate()
      }
      worker.onerror = () => {
        router.push("/resultados")
        worker.terminate()
      }
      worker.postMessage(data)
    } catch {
      router.push("/resultados")
    }
  }

  return (
    <div className="md:max-w-md md:mx-auto">
      {step === 1 && (
        <StepProfile initialData={data.profile} onNext={(d) => { setData({ ...data, profile: d }); next(); }} />
      )}
      {step === 2 && (
        <StepWaterTemp initialData={data.waterTemp} onBack={back} onNext={(d) => { setData({ ...data, waterTemp: d }); next(); }} />
      )}
      {step === 3 && (
        <StepDensity initialData={data.density} onBack={back} onNext={(d) => { setData({ ...data, density: d }); next(); }} />
      )}
      {step === 4 && (
        <StepTimes initialData={data.times} onBack={back} onNext={(d) => { setData({ ...data, times: d }); next(); }} />
      )}
      {step === 5 && (
        <StepReviewCalculate data={data} onBack={back} onCalculate={handleCalculate} />
      )}
    </div>
  )
}