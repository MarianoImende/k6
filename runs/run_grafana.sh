#!/bin/bash

# Configuración
GRAFANA_DIR="$(pwd)/grafana-v12.0.1"
GRAFANA_BIN="$GRAFANA_DIR/bin/grafana"
GRAFANA_CONF="$GRAFANA_DIR/conf/custom.ini"
LOG_FILE="$GRAFANA_DIR/grafana.log"

# Validación de binario
if [ ! -f "$GRAFANA_BIN" ]; then
  echo "Error: No se encontró el binario de Grafana en: $GRAFANA_BIN"
  exit 1
fi

# Matar instancias anteriores
echo "Terminando instancias anteriores de Grafana..."
pkill -f "$GRAFANA_BIN"

# Espera
sleep 1

# Limpiar log
> "$LOG_FILE"

# Ejecutar
echo "Iniciando Grafana desde: $GRAFANA_BIN"
nohup "$GRAFANA_BIN" server \
  --homepath="$GRAFANA_DIR" \
  --config="$GRAFANA_CONF" > "$LOG_FILE" 2>&1 &

# Verificar
sleep 2
PID=$(pgrep -f "$GRAFANA_BIN")
if [ -n "$PID" ]; then
  echo "Grafana corriendo con PID $PID"
  echo "Accedé en: http://localhost:3001 (o desde Windows por IP)"
  echo "Log: $LOG_FILE"
else
  echo "Algo falló al iniciar Grafana. Revisá el log: $LOG_FILE"
fi
