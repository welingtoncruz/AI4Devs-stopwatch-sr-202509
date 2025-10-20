# ⏱️ Stopwatch & Countdown Timer

Aplicação web completa de cronômetros e contadores regressivos com suporte a múltiplos timers simultâneos.

![Stopwatch Demo](../res/stopwatch.png)

## 🚀 Funcionalidades

### ✅ Cronômetro (Stopwatch)
- Contagem crescente de tempo
- Precisão de milissegundos
- Controles Start/Pause/Clear
- Atualização visual suave (60fps)

### ✅ Contador Regressivo (Countdown)
- Configuração de tempo inicial (horas, minutos, segundos)
- Contagem regressiva até zero
- **Notificação do navegador** ao finalizar
- **Som de alerta** ao chegar a zero
- Alerta visual na interface

### ⭐ Múltiplos Timers
- Criar quantos timers precisar (cronômetros e countdowns)
- Cada timer funciona independentemente
- Controles individuais para cada timer
- Adicionar e remover timers dinamicamente

## 🎨 Design

- Interface moderna com gradientes
- Display digital estilo cronômetro
- Animações suaves e responsivas
- Layout adaptável (desktop, tablet, mobile)
- Acessibilidade (ARIA labels, reduced motion)

## 🛠️ Tecnologias

- **HTML5** semântico
- **CSS3** puro (Flexbox + Grid)
- **JavaScript ES6+** vanilla (sem frameworks)
- **Web Audio API** para sons
- **Notification API** para alertas
- **requestAnimationFrame** para performance

## 📦 Como Usar

### 1. Abrir a Aplicação

Simplesmente abra o arquivo `index.html` no seu navegador:

```bash
# No macOS
open index.html

# No Linux
xdg-open index.html

# No Windows
start index.html
```

Ou arraste o arquivo para o navegador.

### 2. Criar um Cronômetro

1. Clique em **"Adicionar Cronômetro"**
2. Um card aparecerá com display zerado (00:00:00.000)
3. Clique em **Start** (botão verde) para iniciar
4. Clique em **Pause** (botão amarelo) para pausar
5. Clique em **Clear** (botão vermelho) para zerar

### 3. Criar um Countdown

1. Clique em **"Adicionar Countdown"**
2. Configure o tempo nos inputs (horas, minutos, segundos)
3. Clique em **Start** para iniciar a contagem regressiva
4. Quando chegar a zero:
   - 🔔 Notificação do navegador aparece
   - 🔊 Som de alerta toca
   - ⚠️ Alerta visual no card

### 4. Múltiplos Timers

- Crie quantos timers precisar
- Todos funcionam ao mesmo tempo
- Cada um tem controles independentes
- Clique no **✕** no canto superior direito para remover

## 🎯 Recursos Avançados

### Notificações
Na primeira vez, o navegador solicitará permissão para enviar notificações. Aceite para receber alertas quando countdowns finalizarem.

### Som de Alerta
O som é gerado programaticamente usando Web Audio API (tom senoidal 800Hz). Funciona em todos os navegadores modernos.

### Performance
- Usa `requestAnimationFrame` para atualização suave
- Milissegundos atualizados a 60fps
- Cleanup automático ao remover timers
- Zero memory leaks

## 📱 Compatibilidade

Testado e funcionando em:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Requisitos**:
- JavaScript habilitado
- Navegador moderno (suporte a ES6+)

## 📂 Estrutura de Arquivos

```
stopwatch-WJC/
├── index.html          # Estrutura HTML da aplicação
├── styles.css          # Estilos e design
├── script.js           # Lógica JavaScript
├── prompts.md          # Documentação de prompts
├── chatbot.md          # Experiência com IA
└── README.md           # Este arquivo
```

## 🧪 Como Testar

### Teste Básico
1. Abra a aplicação
2. Adicione um cronômetro
3. Clique em Start
4. Verifique se os milissegundos atualizam suavemente
5. Teste Pause e Clear

### Teste de Countdown
1. Adicione um countdown
2. Configure 10 segundos
3. Clique em Start
4. Aguarde chegar a zero
5. Verifique notificação e som

### Teste de Múltiplos Timers
1. Adicione 3 cronômetros
2. Adicione 2 countdowns
3. Inicie todos ao mesmo tempo
4. Verifique que todos funcionam independentemente
5. Remova alguns e verifique que outros continuam

## 🐛 Troubleshooting

### Notificações não aparecem
- Verifique permissões do navegador
- Confirme que notificações não estão bloqueadas
- No Chrome: ícone de cadeado → Configurações do site

### Som não toca
- Verifique volume do sistema
- Alguns navegadores bloqueiam áudio automático
- Interaja com a página antes (clique em qualquer lugar)

### Milissegundos não atualizam
- Verifique console do navegador (F12)
- Navegador pode estar em modo de economia de energia
- Tente outro navegador

## 📝 Documentação Adicional

- **prompts.md**: Estratégia de prompting e desenvolvimento
- **chatbot.md**: Experiência com desenvolvimento assistido por IA

## 👨‍💻 Autor

Desenvolvido para o projeto AI4Devs

**Iniciais**: WJC  
**Tecnologia**: Claude Sonnet 4.5 (Cursor AI)  
**Data**: Outubro 2025

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

---

## 🎓 Aprendizados

Este projeto demonstra:
- ✅ Prompt engineering eficaz
- ✅ Desenvolvimento web moderno
- ✅ Arquitetura orientada a objetos em JavaScript
- ✅ APIs Web modernas (Audio, Notification)
- ✅ Performance e otimização
- ✅ Design responsivo
- ✅ Acessibilidade

## 🚀 Melhorias Futuras

Possíveis extensões:
- [ ] Persistência em localStorage
- [ ] PWA (Progressive Web App)
- [ ] Modo claro/escuro
- [ ] Sons customizados
- [ ] Lap times no cronômetro
- [ ] Exportar histórico
- [ ] Compartilhar via URL

---

**Enjoy timing! ⏱️**

