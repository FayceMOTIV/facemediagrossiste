#!/bin/bash
# Script pour créer les secrets GCP Secret Manager
# Lance avec : bash scripts/create-secrets.sh
# Requiert : gcloud auth login au préalable

PROJECT="facemediagrossiste"

echo "🔐 Création des secrets GCP Secret Manager pour $PROJECT"

create_secret() {
  local NAME=$1
  local VALUE=$2
  echo -n "$VALUE" | gcloud secrets create "$NAME" \
    --data-file=- \
    --project="$PROJECT" \
    --replication-policy="automatic" 2>/dev/null \
  && echo "✓ $NAME créé" \
  || echo "⚠️  $NAME existe déjà ou erreur — mise à jour..."

  # Ajoute une nouvelle version si le secret existe déjà
  echo -n "$VALUE" | gcloud secrets versions add "$NAME" \
    --data-file=- \
    --project="$PROJECT" 2>/dev/null && echo "✓ $NAME version mise à jour"
}

# Lire les valeurs depuis le .env.local
ENV_FILE="$(dirname "$0")/../.env.local"

get_env() {
  grep "^$1=" "$ENV_FILE" | cut -d'=' -f2- | tr -d '"'
}

FIREBASE_PRIVATE_KEY=$(get_env FIREBASE_PRIVATE_KEY)
FIREBASE_CLIENT_EMAIL=$(get_env FIREBASE_CLIENT_EMAIL)
FIREBASE_PROJECT_ID_VAL=$(get_env FIREBASE_PROJECT_ID)

echo ""
echo "--- Secrets Firebase Admin (valeurs connues) ---"
create_secret "FIREBASE_PROJECT_ID" "$FIREBASE_PROJECT_ID_VAL"
create_secret "FIREBASE_CLIENT_EMAIL" "$FIREBASE_CLIENT_EMAIL"
create_secret "FIREBASE_PRIVATE_KEY" "$FIREBASE_PRIVATE_KEY"

echo ""
echo "--- Secrets à renseigner manuellement ---"
echo "Remplace PLACEHOLDER par les vraies valeurs ci-dessous :"
echo ""

read -p "OPENAI_API_KEY (sk-...) : " OPENAI_KEY
[ -n "$OPENAI_KEY" ] && create_secret "OPENAI_API_KEY" "$OPENAI_KEY" || echo "⏭  OPENAI_API_KEY ignoré"

read -p "GOOGLE_GENERATIVE_AI_API_KEY (AIza...) : " GEMINI_KEY
[ -n "$GEMINI_KEY" ] && create_secret "GOOGLE_GENERATIVE_AI_API_KEY" "$GEMINI_KEY" || echo "⏭  GOOGLE_GENERATIVE_AI_API_KEY ignoré"

read -p "SMTP_USER (email Brevo) : " SMTP_U
[ -n "$SMTP_U" ] && create_secret "SMTP_USER" "$SMTP_U" || echo "⏭  SMTP_USER ignoré"

read -p "SMTP_PASS (clé SMTP Brevo) : " SMTP_P
[ -n "$SMTP_P" ] && create_secret "SMTP_PASS" "$SMTP_P" || echo "⏭  SMTP_PASS ignoré"

read -p "LANGFUSE_PUBLIC_KEY : " LF_PUB
[ -n "$LF_PUB" ] && create_secret "LANGFUSE_PUBLIC_KEY" "$LF_PUB" || echo "⏭  LANGFUSE_PUBLIC_KEY ignoré"

read -p "LANGFUSE_SECRET_KEY : " LF_SEC
[ -n "$LF_SEC" ] && create_secret "LANGFUSE_SECRET_KEY" "$LF_SEC" || echo "⏭  LANGFUSE_SECRET_KEY ignoré"

read -p "SENTRY_AUTH_TOKEN : " SENTRY_T
[ -n "$SENTRY_T" ] && create_secret "SENTRY_AUTH_TOKEN" "$SENTRY_T" || echo "⏭  SENTRY_AUTH_TOKEN ignoré"

echo ""
echo "✅ Terminé. Secrets disponibles dans :"
echo "https://console.cloud.google.com/security/secret-manager?project=$PROJECT"
echo ""
echo "⚠️  N'oublie pas d'accorder l'accès au compte de service App Hosting :"
echo "gcloud projects add-iam-policy-binding $PROJECT \\"
echo "  --member='serviceAccount:firebase-app-hosting-compute@system.gserviceaccount.com' \\"
echo "  --role='roles/secretmanager.secretAccessor'"
