# @devapps/vue-kit

Um toolkit Vue 3 + TypeScript que fornece uma base arquitetural robusta para aplicações frontend que consomem APIs Laravel.

## 1. Introdução
O pacote `@devapps/vue-kit` providencia infraestrutura padronizada para:
- Cliente HTTP (wrapper sobre o Axios)
- Autenticação (JWT e Sanctum/Cookie)
- Services Base e Stores do Pinia
- Formulários com extração de erros 422 do Laravel
- Gerenciamento de Paginação
- CLI para scaffolding e geração de módulos (services, stores, types, views)
- Componentes de UI compartilhados (Modals, Toasts)

## 2. Instalação
```bash
npm install @devapps/vue-kit
npm install -D typescript vue pinia
```

## 3. Configuração
Configure a instância do `VueKit`, tipicamente no seu `src/main.ts` ou num arquivo dedicado de configuração:
```ts
import { createVueKit } from '@devapps/vue-kit'

export const vueKit = createVueKit({
  api: {
    baseURL: import.meta.env.VITE_API_URL,
    auth: { driver: 'jwt' } // ou 'cookie'
  }
})
```

## 4. Autenticação
Você pode configurar o driver de autenticação da seguinte maneira:
- **JWT**: `auth: { driver: 'jwt' }` (Utiliza `localStorage` por padrão para salvar os tokens).
- **Cookie (Sanctum)**: `auth: { driver: 'cookie', csrf: { enabled: true, endpoint: '/sanctum/csrf-cookie' } }`.

## 5. Services & Stores
Estenda a classe `BaseService` ou utilize `CrudService` para interagir com a sua API.

Utilize o `defineCrudStore` para criar rapidamente stores do Pinia completas com todas as funcionalidades de CRUD:
```ts
import { defineCrudStore, CrudService } from '@devapps/vue-kit'

class CustomerService extends CrudService<Customer> {
  constructor() { super(vueKit.http, '/customers') }
}

export const useCustomerStore = defineCrudStore('customer', () => new CustomerService())
```

## 6. Formulários (Forms)
A classe `Form<T>` gerencia reativamente o estado, submissão e os erros de validação, integrando-se de maneira transparente aos formatos de resposta padrão do Laravel.
```ts
import { Form } from '@devapps/vue-kit'

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
import { BaseModal, ConfirmDeleteModal, ToastContainer, useToast } from '@devapps/vue-kit/ui'
```

Adicione o `ToastContainer` no layout principal da sua aplicação (App.vue) e utilize o composable `useToast` em qualquer lugar para exibir notificações na tela.
