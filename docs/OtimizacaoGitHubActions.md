# Otimização dos GitHub Actions Workflows

Documento de referência sobre as otimizações aplicadas nos workflows para economizar minutos do plano gratuito do GitHub Actions.

---

## Problema Identificado

O workflow `Client Monitor MD Supabase` parou de executar em **29/Jan/2026** por esgotamento dos minutos gratuitos do GitHub Actions.

**Consumo anterior:**
- Frequência: a cada 30 minutos = **48 execuções/dia**
- Tempo médio por execução: ~5 minutos (sem cache do Playwright)
- **Total: ~240 min/dia → ~7.200 min/mês** (limite gratuito: 2.000 min/mês)

---

## Otimizações Aplicadas

### 1. Cache do Playwright (Chromium)
**Arquivo:** `.github/workflows/scrape.yml`

O download do navegador Chromium (~130MB) acontecia do zero a cada execução. Com o cache, ele é baixado apenas 1 vez e reutilizado nas próximas.

```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v3
  id: playwright-cache
  with:
    path: ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-chromium-${{ hashFiles('**/requirements.txt') }}

- name: Install Playwright browsers
  if: steps.playwright-cache.outputs.cache-hit != 'true'
  run: playwright install chromium
```

> **Economia:** ~60-90 segundos por execução

### 2. Redução de Frequência
**De:** `*/30 * * * *` (a cada 30 minutos)
**Para:** `0 */3 * * *` (a cada 3 horas)

| Antes | Depois |
|-------|--------|
| 48 execuções/dia | 8 execuções/dia |
| ~240 min/dia | ~16 min/dia |
| ~7.200 min/mês | ~480 min/mês |

> **Economia:** 83% menos execuções

### 3. Remoção do `sync.yml`
O arquivo estava vazio e falhava em todo `git push`, consumindo minutos inutilmente.

---

## Consumo Estimado Após Otimizações

| Workflow | Frequência | Tempo/execução | Min/mês |
|----------|-----------|----------------|---------|
| Scrape (monitor) | 8x/dia | ~2 min | ~480 |
| Analyze | 1x/semana | ~3 min | ~12 |
| Deploy | Sob demanda | ~2 min | ~10 |
| **Total estimado** | | | **~502 min/mês** |

✅ Dentro do limite gratuito de **2.000 min/mês** com folga!
