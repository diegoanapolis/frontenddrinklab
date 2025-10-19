// Simple calculation web worker
self.onmessage = (event) => {
  const data = event.data || {}
  try {
    const profile = data.profile || {}
    const waterTemp = data.waterTemp || {}
    const density = data.density || {}
    const times = data.times || {}

    const mean = (arr) => {
      const xs = Array.isArray(arr) ? arr.filter((x) => typeof x === "number" && !isNaN(x)) : []
      if (xs.length === 0) return null
      return xs.reduce((a, b) => a + b, 0) / xs.length
    }

    const stdev = (arr) => {
      const xs = Array.isArray(arr) ? arr.filter((x) => typeof x === "number" && !isNaN(x)) : []
      if (xs.length < 2) return null
      const m = mean(xs)
      const variance = xs.reduce((sum, x) => sum + Math.pow(x - m, 2), 0) / (xs.length - 1)
      return Math.sqrt(variance)
    }

    const cv = (arr) => {
      const m = mean(arr)
      const s = stdev(arr)
      if (m === null || s === null || m === 0) return null
      return (s / m) * 100
    }

    const waterMassMean = mean(density.waterMasses)
    const sampleMassMean = mean(density.sampleMasses)
    const cvWaterMass = cv(density.waterMasses)
    const cvSampleMass = cv(density.sampleMasses)
    const densityRel = (waterMassMean != null && sampleMassMean != null && waterMassMean !== 0)
      ? sampleMassMean / waterMassMean
      : null

    const waterTimeMean = mean(times.waterTimes)
    const sampleTimeMean = mean(times.sampleTimes)
    const cvWaterTime = cv(times.waterTimes)
    const cvSampleTime = cv(times.sampleTimes)
    const viscosityRel = (waterTimeMean != null && sampleTimeMean != null && waterTimeMean !== 0)
      ? sampleTimeMean / waterTimeMean
      : null

    const observations = []
    if (cvWaterMass != null && cvWaterMass > 2) observations.push("CV da massa da água acima de 2%")
    if (cvSampleMass != null && cvSampleMass > 2) observations.push("CV da massa da amostra acima de 2%")
    if (cvWaterTime != null && cvWaterTime > 3) observations.push("CV do tempo da água acima de 3%")
    if (cvSampleTime != null && cvSampleTime > 3) observations.push("CV do tempo da amostra acima de 3%")

    // Placeholder adherence and label compatibility
    const adherence = { rMuPercent: null, zScore: null }
    let labelStatus = "Indeterminado"
    let labelReason = "Sem cálculo de ABV ainda"

    const result = {
      conditions: {
        temperature: waterTemp.temperature ?? null,
        waterType: waterTemp.waterType ?? null,
        beverageType: profile.beverageType ?? null,
        labelAbv: profile.labelAbv ?? null,
      },
      density: {
        waterMean: waterMassMean,
        sampleMean: sampleMassMean,
        densityRel,
        cvWaterMass,
        cvSampleMass,
      },
      viscosity: {
        waterMeanTime: waterTimeMean,
        sampleMeanTime: sampleTimeMean,
        viscosityRel,
        cvWaterTime,
        cvSampleTime,
      },
      adherence,
      labelCompat: { status: labelStatus, reason: labelReason },
      methanol: { screening: "Não sugerido" },
      observations,
      createdAt: new Date().toISOString(),
    }

    // respond
    postMessage({ ok: true, result })
  } catch (err) {
    postMessage({ ok: false, error: String(err && err.message ? err.message : err) })
  }
}