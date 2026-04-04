import puppeteer from "puppeteer";
import lighthouse from "lighthouse";
import { URL } from "url";
import fs from "fs";
import {
  SIZES,
  FORMATS,
  MINIFY_OPTIONS,
  GZIP_OPTIONS,
  NUM_EXECUTIONS,
  CLIENT_URL,
  SERVER_URL,
} from "./constants.mjs";
import createReport from "./generateReport.mjs";

const lighthouseFlags = {
  output: "json",
  onlyCategories: ["performance"],
  maxWaitForLoad: 90000, // 90 segundos timeout
};

// Função para executar Lighthouse com Puppeteer (com retry)
async function runLighthouse(url, browser, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { lhr } = await lighthouse(url, {
        ...lighthouseFlags,
        port: new URL(browser.wsEndpoint()).port,
      });

      const metrics = {
        lcp: lhr.audits["largest-contentful-paint"]?.numericValue || 0,
        cls: lhr.audits["cumulative-layout-shift"]?.numericValue || 0,
        fcp: lhr.audits["first-contentful-paint"]?.numericValue || 0,
        si: lhr.audits["speed-index"]?.numericValue || 0,
        tti: lhr.audits["interactive"]?.numericValue || 0,
        fid: lhr.audits["max-potential-fid"]?.numericValue || 0,
        score: lhr.categories.performance.score * 100,
      };
      return metrics;
    } catch (error) {
      console.error(`  Lighthouse attempt ${attempt}/${retries} failed:`, error.message);
      if (attempt === retries) {
        // Se todas as tentativas falharam, retorna métricas zeradas
        console.error(`  All attempts failed for ${url}, returning zero metrics`);
        return {
          lcp: 0,
          cls: 0,
          fcp: 0,
          si: 0,
          tti: 0,
          fid: 0,
          score: 0,
        };
      }
      // Espera antes de tentar novamente
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

// Função para coletar as métricas de heap e uso de CPU do sistema
async function getHeapAndCpuUsage() {
  const cpuUsage = process.cpuUsage();
  const memoryUsage = process.memoryUsage();

  return {
    heapTotal: memoryUsage.heapTotal / 1024, // Convert to KB
    heapUsed: memoryUsage.heapUsed / 1024,
    jsHeapUsed: memoryUsage.heapUsed / 1024,
    jsHeapTotal: memoryUsage.heapTotal / 1024,
    rss: memoryUsage.rss / 1024,
    systemCpuUser: cpuUsage.user / 1000, // Convert to milliseconds
    systemCpuSystem: cpuUsage.system / 1000,
  };
}

// Função para construir URL baseado nos fatores
function buildUrl(size, format, minify, gzip) {
  if (format === "json") {
    return `${CLIENT_URL}/json.html?size=${size}&minify=${minify}&gzip=${gzip}`;
  } else {
    return `${SERVER_URL}size=${size}&format=html&gzip=${gzip}`;
  }
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage", // Ajuda com problemas de memória
      "--disable-gpu",
    ],
  });
  const page = await browser.newPage();
  
  // Configurar timeout da página
  page.setDefaultTimeout(60000); // 60 segundos
  page.setDefaultNavigationTimeout(60000);
  console.time("Total execution time");
  let allResults = [];

  // Loop por cada combinação de fatores
  for (let size of SIZES) {
    for (let format of FORMATS) {
      // Para HTML, minify não se aplica (sempre 0)
      // Para JSON, testamos ambos os valores de minify
      const minifyOptions =
        format === "json" ? MINIFY_OPTIONS : [0];

      for (let minify of minifyOptions) {
        for (let gzip of GZIP_OPTIONS) {
          const url = buildUrl(size, format, minify, gzip);
          const scenarioName = `${size}-${format}-minify${minify}-gzip${gzip}`;

          console.log(
            `Testing: Size=${size}, Format=${format}, Minify=${minify}, Gzip=${gzip}`
          );
          console.log(`URL: ${url}`);

          // Array para armazenar os resultados de cada execução
      let runResults = [];

          // Executa o teste NUM_EXECUTIONS vezes
          for (let i = 0; i < NUM_EXECUTIONS; i++) {
            console.log(
              `  Iteration ${i + 1}/${NUM_EXECUTIONS} for ${scenarioName}`
            );
            
            try {
              // Timeout maior para páginas grandes (60 segundos)
              await page.goto(url, {
                waitUntil: "domcontentloaded", // Mais rápido que networkidle0
                timeout: 60000,
              });

              // Executa o Lighthouse e obtém as métricas de desempenho
              const lighthouseMetrics = await runLighthouse(url, browser);

              // Coleta as métricas de heap e uso de CPU do sistema
              const heapAndCpuMetrics = await getHeapAndCpuUsage();

              // Combina as métricas do Lighthouse com as métricas de heap e CPU
              runResults.push({
                format,
                size,
                minify,
                gzip,
                ...lighthouseMetrics,
                ...heapAndCpuMetrics,
              });
            } catch (error) {
              console.error(
                `  Error in iteration ${i + 1} for ${scenarioName}:`,
                error.message
              );
              // Adiciona resultado com métricas zeradas para manter consistência
              const heapAndCpuMetrics = await getHeapAndCpuUsage();
              runResults.push({
                format,
                size,
                minify,
                gzip,
                lcp: 0,
                cls: 0,
                fcp: 0,
                si: 0,
                tti: 0,
                fid: 0,
                score: 0,
                ...heapAndCpuMetrics,
              });
            }
            
            // Pequena pausa entre iterações para evitar sobrecarga
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

      // Salva os resultados individuais em um arquivo separado
          const resultsDir = "./results";
          if (!fs.existsSync(resultsDir)) {
            fs.mkdirSync(resultsDir, { recursive: true });
          }
      fs.writeFileSync(
            `${resultsDir}/${scenarioName}-individual.json`,
        JSON.stringify(runResults, null, 2)
      );

          // Adiciona todos os resultados individuais à lista geral
          allResults.push(...runResults);
        }
      }
    }
  }

  await browser.close();
  console.timeEnd("Total execution time");

  // Salvar todos os resultados individuais em um arquivo JSON consolidado
  const resultsDir = "./results";
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  fs.writeFileSync(
    `${resultsDir}/all-results.json`,
    JSON.stringify(allResults, null, 2)
  );

  // Gerar CSV usando o generateReport
  const csvWriter = createReport({ order: "all-results" });
  await csvWriter.writeRecords(
    allResults.map((result) => ({
      format: result.format,
      size: result.size,
      minify: result.minify,
      gzip: result.gzip,
      performanceScore: result.score,
      LCP: result.lcp / 1000, // Convert ms to seconds
      FID: result.fid,
      CLS: result.cls,
      FCP: result.fcp / 1000, // Convert ms to seconds
      SI: result.si / 1000, // Convert ms to seconds
      TTI: result.tti / 1000, // Convert ms to seconds
      userCpu: result.systemCpuUser,
      systemCpu: result.systemCpuSystem,
      rss: result.rss,
      heapTotal: result.heapTotal,
      heapUsed: result.heapUsed,
      JSHeapUsedSize: result.jsHeapUsed,
      JSHeapTotalSize: result.jsHeapTotal,
    }))
  );

  console.log("Lighthouse tests completed. Results saved to ./results/");
  console.log(`Total scenarios tested: ${allResults.length / NUM_EXECUTIONS}`);
  console.log(`Total individual results: ${allResults.length}`);
})();
