# Анализ городов

Сравнительный потенциал креативной реиндустриализации городов второго эшелона.

Сайт статический. Данные берутся из приватного репозитория `cities-analysis-data`:
при сборке `scripts/build_data.py` превращает CSV в JSON-файлы `public/data/` (в git они не хранятся).

```bash
pip install pandas
python scripts/build_data.py ../cities-analysis-data   # путь к клону приватного репозитория
npm install
npm start      # локальный запуск
npm run build  # сборка
```

Деплой на GitHub Pages — GitHub Actions (`.github/workflows/deploy.yml`) при пуше в `main`.
