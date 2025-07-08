#!/bin/bash

# Configuración
VM_BIN="./victoria-metrics-prod"
DATA_DIR="./data"
LOG_FILE="./vm.log"

# Crear carpeta de datos si no existe
mkdir -p "$DATA_DIR"

# Matar instancias anteriores si las hubiera
echo "Terminando instancias anteriores de VictoriaMetrics..."
pkill -f "$VM_BIN"

# Lanzar VictoriaMetrics en segundo plano con nohup
echo "Iniciando VictoriaMetrics..."
nohup $VM_BIN -retentionPeriod=1 -storageDataPath=$DATA_DIR > $LOG_FILE 2>&1 &

# Mostrar PID y estado
sleep 1
PID=$(pgrep -f "$VM_BIN")
if [[ -n "$PID" ]]; then
  echo "? VictoriaMetrics corriendo con PID $PID"
  echo "?? Endpoint: http://localhost:8428"
  echo "?? Datos en: $DATA_DIR"
  echo "?? Log en:   $LOG_FILE"
else
  echo "? Algo falló al iniciar VictoriaMetrics. Revisón el log: $LOG_FILE"
fi
