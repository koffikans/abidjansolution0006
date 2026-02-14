import"./modulepreload-polyfill-B5Qt9EMX.js";import{G as m}from"./index-2Qi4geEX.js";class g{constructor(e){if(this.chat=null,this.conversationHistory=[],this.leadSent=!1,this.systemInstruction=`
        You are an expert virtual sales assistant named AbidjanBot, integrated into a high-traffic website. 
        Your primary role is to proactively engage with visitors, understand their specific needs regarding our products/services, and qualify them. 
        Your ultimate goal is to convert their interest into a concrete action: scheduling a phone call or requesting a quote/invoice.
        
        Conversation Flow:
        1.  Greeting & Proactive Engagement: Start with a warm, professional, and slightly proactive greeting. Example: "Bonjour et bienvenue sur Abidjan Solution ! Je suis AbidjanBot, votre assistant. Cherchez-vous quelque chose de spécifique aujourd'hui ou puis-je vous présenter nos produits phares ?"
        2.  Needs Discovery: Use open-ended questions to understand the user's requirements. Examples: "Pourriez-vous m'en dire plus sur le type de machine que vous recherchez ?", "Quel est le secteur d'activité de votre entreprise ?", "Avez-vous un projet spécifique en tête ?"
        3.  Product/Service Matching: Based on their needs, recommend specific products or services from our catalog. Be precise and helpful using the categories below.
        4.  Qualification & Call to Action: Once interest is confirmed, pivot towards the conversion goal. Be direct but courteous.
            -   For a Call: "Cela semble être un projet intéressant. Un de nos experts pourrait vous appeler pour discuter des détails techniques et vous fournir un conseil personnalisé. Seriez-vous disponible pour un bref appel ?" If yes, ask for their phone number and name.
            -   For a Quote: "Je peux vous préparer un devis détaillé pour cet équipement. Pour cela, j'aurai besoin de votre nom complet, du nom de votre entreprise et de votre adresse e-mail. Souhaitez-vous que je lance la procédure ?"
        5.  Handling Objections/Questions: Answer any questions concisely and accurately. If you don't know the answer, state: "C'est une excellente question. Pour vous donner une information précise, il serait préférable qu'un de nos spécialistes vous contacte directement."

        Our Product Categories:
        Quand un utilisateur vous interroge sur nos produits, utilisez cette liste pour le guider. Soyez prêt à discuter des articles dans ces catégories.
        -   Fabrication Locale : Ceci inclut des machines fabriquées localement comme la 'Broyeuse de Manioc' et la 'Presse à Huile'. Elles sont destinées à la transformation alimentaire.
        -   Appareils Électroménagers (Neuf) : Des appareils ménagers et industriels neufs. Cela comprend des machines à coudre industrielles et des moteurs diesel.
        -   Matériel Lourd (Location/Vente Occasion) : Nous proposons du matériel lourd d'occasion à la location ou à la vente. Par exemple, des tracteurs agricoles (John Deere), des pelleteuses (CAT), des groupes électrogènes diesel et des camions-bennes (Renault Kerax).
        -   Packs Industriels : Des solutions industrielles complètes pour la mise en place d'unités de production, comme pour l'Attiéké ou l'Huile de Palme.
        -   Services Numériques & Virtuelles : Nous fournissons des services numériques, y compris l'échange de cryptomonnaies (Bitcoin, USDT) et la création de sites e-commerce.
        Essayez toujours de faire correspondre les besoins de l'utilisateur à l'une de ces catégories et donnez des exemples précis si possible.
        
        Key Instructions:
        -   Language: Always communicate in clear, professional, and friendly French (fr-FR).
        -   Conciseness: Keep your responses brief and to the point.
        -   Goal-Oriented: Never lose sight of the primary goal: getting a phone number for a call or details for a quote.
        -   Persona: You are helpful, expert, and efficient.
        -   Data Collection: Only ask for contact information (phone or email) AFTER the user has agreed to be contacted or receive a quote.
    `,this.autoResizeInput=()=>{this.elements.input&&(this.elements.input.style.height="auto",this.elements.input.style.height=`${this.elements.input.scrollHeight}px`)},!e)throw new Error("API key is missing. Please ensure the API_KEY environment variable is set.");this.ai=new m({apiKey:e}),this.elements={container:null,messagesContainer:null,input:null,sendBtn:null,typingIndicator:null},this.initializeChatbot()}async initializeChatbot(){try{this.chat=this.ai.chats.create({model:"gemini-3-flash-preview",config:{systemInstruction:this.systemInstruction},history:this.conversationHistory}),this.buildUI(),this.addEventListeners();const e="Bonjour et bienvenue ! Je suis AbidjanBot. Comment puis-je vous aider à trouver le produit ou service parfait pour votre projet aujourd'hui ?";this.addMessage(e,"bot"),this.conversationHistory.push({role:"model",parts:[{text:e}]})}catch(e){console.error("Chat initialization failed:",e),this.displayError("L'assistant IA n'a pas pu démarrer. Veuillez vérifier la configuration.")}}buildUI(){const e=document.getElementById("chatbot-root");if(!e)return;e.innerHTML=`
            <div class="chatbot-container">
                <div class="chatbot-header">
                    <div class="header-content">
                        <span class="header-icon">💬</span>
                        <div class="header-text">
                            <span class="header-title">AbidjanBot</span>
                            <span class="header-status">En ligne</span>
                        </div>
                    </div>
                </div>
                <div class="chatbot-messages"></div>
                <div class="chatbot-input-area">
                    <textarea placeholder="Posez votre question..." rows="1"></textarea>
                    <button aria-label="Envoyer le message">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
                        </svg>
                    </button>
                </div>
            </div>
        `,this.elements.container=e.querySelector(".chatbot-container"),this.elements.messagesContainer=e.querySelector(".chatbot-messages"),this.elements.input=e.querySelector("textarea"),this.elements.sendBtn=e.querySelector("button");const t=document.createElement("div");t.className="message bot typing-indicator",t.innerHTML="<span></span><span></span><span></span>",this.elements.typingIndicator=t}addEventListeners(){var e,t,i;(e=this.elements.sendBtn)==null||e.addEventListener("click",()=>this.sendMessage()),(t=this.elements.input)==null||t.addEventListener("keydown",s=>{s.key==="Enter"&&!s.shiftKey&&(s.preventDefault(),this.sendMessage())}),(i=this.elements.input)==null||i.addEventListener("input",this.autoResizeInput)}addMessage(e,t){var s;const i=document.createElement("div");i.className=`message ${t}`,i.textContent=e,(s=this.elements.messagesContainer)==null||s.appendChild(i),this.scrollToBottom()}displayError(e){const t=document.getElementById("chatbot-root");t&&(t.innerHTML=`<div class="error-message">${e}</div>`)}showTyping(e){var t,i;e&&this.elements.typingIndicator?((t=this.elements.messagesContainer)==null||t.appendChild(this.elements.typingIndicator),this.scrollToBottom()):(i=this.elements.typingIndicator)==null||i.remove()}scrollToBottom(){var e;(e=this.elements.messagesContainer)==null||e.scrollTo({top:this.elements.messagesContainer.scrollHeight,behavior:"smooth"})}async checkForLead(e){var c;if(this.leadSent)return;const t=/[\w.-]+@[\w.-]+\.\w+/,i=/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,3}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}[-.\s]?\d{2,4}/,s=e.match(t),l=e.match(i);if(s||l){this.leadSent=!0;const u=s?s[0]:l[0],d=s?"devis":"appel",r=/(?:je m'appelle|mon nom est)\s+([\w\s]+)/i;let a=((c=e.match(r))==null?void 0:c[1].trim())||"N/A";if(a==="N/A"){const n=[...this.conversationHistory].reverse().find(p=>p.parts[0].text.match(r));n&&(a=n.parts[0].text.match(r)[1].trim())}const h=this.conversationHistory.slice(-4).map(n=>`${n.role==="user"?"Client":"Bot"}: ${n.parts[0].text}`).join(`
`);await this.sendLeadToBackend({name:a,contact:u,type:d,request:h})}}async sendLeadToBackend(e){try{await fetch("https://us-central1-abidjansolution0006.cloudfunctions.net/saveLeadAndNotify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),console.log("Lead sent successfully")}catch(t){console.error("Failed to send lead to backend:",t),this.leadSent=!1}}async sendMessage(){var t;const e=(t=this.elements.input)==null?void 0:t.value.trim();if(!(!e||!this.chat)){this.addMessage(e,"user"),this.conversationHistory.push({role:"user",parts:[{text:e}]}),this.elements.input.value="",this.autoResizeInput(),this.showTyping(!0),this.checkForLead(e);try{const s=(await this.chat.sendMessage({message:e})).text;this.showTyping(!1),this.addMessage(s,"bot"),this.conversationHistory.push({role:"model",parts:[{text:s}]})}catch(i){console.error("Gemini API call failed:",i),this.showTyping(!1);const s="Désolé, une erreur s'est produite. Veuillez réessayer.";this.addMessage(s,"bot"),this.conversationHistory.push({role:"model",parts:[{text:s}]})}}}}try{new g("AIzaSyBQyQZu16g-cBuBlrzbobTWfkLpijMXNjs")}catch(o){console.error(o.message);const e=document.getElementById("chatbot-root");e&&(e.innerHTML=`<div class="error-message">Could not initialize chatbot: ${o.message}</div>`)}
