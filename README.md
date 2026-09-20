# @devappsnpm/vue-kit

Um toolkit Vue 3 + TypeScript que fornece uma base arquitetural robusta para aplicações frontend que consomem APIs Laravel.

## 1. Introdução
O pacote `@devappsnpm/vue-kit` providencia infraestrutura padronizada para:
- Cliente HTTP (wrapper sobre o Axios)
- Autenticação (JWT e Sanctum/Cookie)
- Services Base e Stores do Pinia
- Formulários com extração de erros 422 do Laravel
- Gerenciamento de Paginação
- CLI para scaffolding e geração de módulos (services, stores, types, views)
- Componentes de UI compartilhados (Modals, Toasts)

## 2. Instalação
```bash
npm install @devappsnpm/vue-kit
npm install -D typescript vue pinia
```

## 3. Configuração
Você pode configurar a instância do `VueKit` de duas maneiras principais: diretamente no seu arquivo principal de inicialização ou separadamente em um arquivo dedicado.

### Opção A: Diretamente no `main.ts`
Esta é a abordagem mais simples, integrando o VueKit diretamente junto à criação da sua aplicação Vue, do Pinia e do Vue Router:

```ts
// src/main.ts
import './assets/app.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVueKit } from '@devappsnpm/vue-kit'

import App from './App.vue'
import router from './router'

// Inicializa a configuração do VueKit
export const vueKit = createVueKit({
  api: {
    baseURL: import.meta.env.VITE_API_URL,
    auth: { driver: 'jwt' } // ou 'cookie'
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

### Opção B: Em um arquivo dedicado
Se você preferir manter seu `main.ts` limpo ou precisar importar a instância do VueKit em lugares onde o `main.ts` causaria dependência circular, crie um arquivo dedicado (ex: `src/plugins/vueKit.ts` ou `src/config.ts`):

```ts
// src/plugins/vueKit.ts
import { createVueKit } from '@devappsnpm/vue-kit'

export const vueKit = createVueKit({
  api: {
    baseURL: import.meta.env.VITE_API_URL,
    auth: { driver: 'jwt' } // ou 'cookie'
  }
})
```

E então, você pode simplesmente importar esse arquivo no seu `main.ts` ou nos seus components/stores conforme necessário.

## 4. Autenticação
Você pode configurar o driver de autenticação da seguinte maneira:
- **JWT**: `auth: { driver: 'jwt' }` (Utiliza `localStorage` por padrão para salvar os tokens).
- **Cookie (Sanctum)**: `auth: { driver: 'cookie', csrf: { enabled: true, endpoint: '/sanctum/csrf-cookie' } }`.

## 5. Services & Stores
Estenda a classe `BaseService` ou utilize `CrudService` para interagir com a sua API.

Utilize o `defineCrudStore` para criar rapidamente stores do Pinia completas com todas as funcionalidades de CRUD:
```ts
import { defineCrudStore, CrudService } from '@devappsnpm/vue-kit'

class CustomerService extends CrudService<Customer> {
  constructor() { super(vueKit.http, '/customers') }
}

export const useCustomerStore = defineCrudStore('customer', () => new CustomerService())
```

## 6. Formulários (Forms)
A classe `Form<T>` gerencia reativamente o estado, submissão e os erros de validação, integrando-se de maneira transparente aos formatos de resposta padrão do Laravel.
```ts
import { Form } from '@devappsnpm/vue-kit'

const form = reactive(new Form({ name: '' }))
await form.submit(async (data) => service.store(data))
```

## 7. CLI (Geração de Código)
A CLI gera módulos boilerplate perfeitamente estruturados para acelerar seu desenvolvimento.
```bash
npx devapps-vue make:module Customer --type=crud --ui=modal
```

Comandos disponíveis:
- `make:module <Name> [--type=basic|resource|crud|dashboard] [--ui=modal|page]`
- `make:component <Name>`
- `make:page <Name>`
- `make:service <Name>`
- `make:store <Name>`
- `make:type <Name>`

## 8. Componentes de UI
Nós fornecemos um entrypoint separado contendo utilitários de UI baseados em Tailwind CSS:
```ts
import { BaseModal, ConfirmDeleteModal, ToastContainer, useToast } from '@devappsnpm/vue-kit/ui'
```

Adicione o `ToastContainer` no layout principal da sua aplicação (App.vue) e utilize o composable `useToast` em qualquer lugar para exibir notificações na tela.
