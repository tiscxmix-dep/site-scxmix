/* =========================================================
   CONFIGURAÇÃO DO SUPABASE
   Supabase > Project Settings > API (ou "Data API" / "API Keys")
   Copie a "Project URL" e a chave pública "anon" (ou "publishable").
   Essa chave é pública e pode ficar aqui: quem protege os dados
   são as regras de segurança criadas pelo schema.sql.
   NUNCA coloque aqui a chave "service_role" / "secret".
   Enquanto os campos estiverem vazios, o site mostra o conteúdo
   de exemplo e o painel avisa que falta configurar.
   ========================================================= */
window.SCX_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: ""
};
