/**
 * @fileoverview Privacy policy page with detailed privacy information
 * @module shared/components/Pages/PrivacyPage
 */

import type { ReactElement } from 'react';
import { Button } from '../UI/Button';

/**
 * Props for the PrivacyPage component
 */
export interface PrivacyPageProps {
  /** Handler for navigating back */
  onBack?: () => void;
}

/**
 * Privacy policy page component
 * 
 * Provides comprehensive privacy policy information, emphasizing
 * local-only data storage and complete user privacy protection.
 * 
 * @component
 * @example
 * ```tsx
 * <PrivacyPage onBack={() => navigate('about')} />
 * ```
 */
export const PrivacyPage = ({ onBack }: PrivacyPageProps): ReactElement => {
  const lastUpdated = '01 de Janeiro de 2024';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <Button
              variant="secondary"
              onClick={onBack}
              className="mb-6"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              }
            >
              Voltar
            </Button>
          )}
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Política de Privacidade
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Última atualização: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Privacy Promise */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4 text-center">
            🔒 Nossa Promessa Fundamental
          </h2>
          <div className="text-center">
            <p className="text-lg text-green-700 dark:text-green-300 mb-4">
              <strong>O My Finance NUNCA coleta, armazena ou transmite seus dados financeiros.</strong>
            </p>
            <p className="text-green-600 dark:text-green-400">
              Todos os seus dados ficam 100% no seu dispositivo, sob seu controle total.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-8 space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Introdução
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  O My Finance foi desenvolvido com um princípio fundamental: 
                  <strong> sua privacidade financeira é inviolável</strong>. Esta política 
                  explica exatamente como protegemos suas informações e por que você pode 
                  confiar completamente na nossa abordagem.
                </p>
              </div>
            </section>

            {/* Data Collection */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                1. Coleta de Dados
              </h2>
              
              <div className="space-y-6">
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">
                    ❌ O que NÃO coletamos
                  </h3>
                  <ul className="space-y-2 text-red-700 dark:text-red-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Dados financeiros (receitas, despesas, categorias)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Informações pessoais (nome, email, telefone)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Dados bancários ou de cartões</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Histórico de navegação</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Localização geográfica</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Cookies de rastreamento</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Analytics ou métricas de uso</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                    ℹ️ Dados técnicos mínimos
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 mb-3">
                    Para que a aplicação funcione, utilizamos apenas:
                  </p>
                  <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span><strong>LocalStorage:</strong> Para armazenar seus dados no seu navegador</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span><strong>Preferências de tema:</strong> Modo claro/escuro (salvo localmente)</span>
                    </li>
                  </ul>
                  <p className="text-blue-600 dark:text-blue-400 text-sm mt-3">
                    <strong>Importante:</strong> Estes dados nunca saem do seu dispositivo.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Storage */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                2. Armazenamento de Dados
              </h2>
              
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                    🏠 Armazenamento Local
                  </h3>
                  <div className="text-green-700 dark:text-green-300 space-y-3">
                    <p>
                      Todos os seus dados financeiros são armazenados exclusivamente no 
                      <strong> localStorage do seu navegador</strong>. Isso significa:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Os dados ficam apenas no seu dispositivo</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Nenhuma informação é enviada para nossos servidores</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Você tem controle total sobre os dados</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Funciona offline após o primeiro carregamento</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
                    ⚠️ Importante sobre o localStorage
                  </h3>
                  <div className="text-yellow-700 dark:text-yellow-300 space-y-2">
                    <p>
                      O localStorage é uma tecnologia do navegador que mantém dados localmente. 
                      <strong> Suas informações podem ser perdidas se</strong>:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Você limpar os dados do navegador manualmente</li>
                      <li>• Usar limpeza automática de dados privados</li>
                      <li>• Reinstalar o navegador sem backup</li>
                      <li>• O dispositivo apresentar problemas técnicos</li>
                    </ul>
                    <p className="mt-3 font-semibold">
                      Por isso, recomendamos fazer backup regular usando a função "Exportar Dados".
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Usage */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                3. Como Usamos Seus Dados
              </h2>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-center text-lg">
                  <strong>Nós NÃO usamos seus dados.</strong>
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
                  Como os dados ficam apenas no seu dispositivo, não temos acesso a eles. 
                  A aplicação processa tudo localmente no seu navegador.
                </p>
              </div>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                4. Compartilhamento de Dados
              </h2>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-center text-lg font-semibold">
                  ❌ NÃO compartilhamos dados com terceiros
                </p>
                <p className="text-red-600 dark:text-red-400 text-center mt-2">
                  Como não coletamos seus dados, é impossível compartilhá-los. 
                  Não temos parcerias comerciais, não vendemos dados e não fazemos marketing direcionado.
                </p>
              </div>
            </section>

            {/* Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                5. Segurança
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      🔐 Criptografia
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      O navegador criptografa automaticamente os dados no localStorage.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                      🏠 Dados Locais
                    </h3>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Informações nunca transitam pela internet.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                      🔒 HTTPS
                    </h3>
                    <p className="text-purple-700 dark:text-purple-300 text-sm">
                      Aplicação servida sempre via conexão segura.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                      👤 Controle Total
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      Você decide quando e como fazer backup.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* User Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                6. Seus Direitos
              </h2>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4">
                  ✅ Você tem controle total
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-700 dark:text-green-300">
                  <div>
                    <h4 className="font-semibold mb-2">Acesso aos Dados</h4>
                    <p className="text-sm">Veja todos os seus dados a qualquer momento na aplicação.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Exportação</h4>
                    <p className="text-sm">Exporte em JSON, Excel, CSV ou Markdown quando quiser.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Exclusão</h4>
                    <p className="text-sm">Apague todos os dados nas configurações do navegador.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Portabilidade</h4>
                    <p className="text-sm">Leve seus dados para onde quiser, sem dependências.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Technical Details */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                7. Detalhes Técnicos
              </h2>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Como verificar que seus dados estão seguros
                </h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div>
                    <p className="font-semibold">1. Ferramentas do Desenvolvedor</p>
                    <p className="text-sm">Pressione F12 → Application → Local Storage → veja seus dados</p>
                  </div>
                  <div>
                    <p className="font-semibold">2. Network Monitor</p>
                    <p className="text-sm">F12 → Network → veja que nenhum dado é enviado</p>
                  </div>
                  <div>
                    <p className="font-semibold">3. Modo Offline</p>
                    <p className="text-sm">Desconecte da internet e veja que tudo continua funcionando</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                8. Atualizações desta Política
              </h2>
              
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300">
                  Esta política pode ser atualizada ocasionalmente para refletir melhorias na aplicação. 
                  Como não coletamos dados de contato, notificaremos mudanças através da própria aplicação. 
                  Mudanças significativas serão destacadas claramente.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                9. Contato
              </h2>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  Tem dúvidas sobre nossa política de privacidade? 
                  Como não coletamos dados, não temos muitas dúvidas para responder, 
                  mas estamos aqui para esclarecer qualquer questão.
                </p>
                <p className="text-blue-600 dark:text-blue-400 text-sm">
                  <strong>Lembre-se:</strong> Se você pode ver seus dados na aplicação, 
                  é porque eles estão no seu dispositivo. Se não conseguimos vê-los, 
                  é porque eles estão seguros com você.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Transparência Total
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Nossa promessa é simples: seus dados financeiros são seus e apenas seus. 
              Construímos o My Finance para que você tenha controle total, 
              privacidade absoluta e tranquilidade completa.
            </p>
            {onBack && (
              <Button
                variant="primary"
                onClick={onBack}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Voltar à Aplicação
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};