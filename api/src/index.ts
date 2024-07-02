import { Hono } from 'hono'
import { html, raw } from 'hono/html'

const loginPage=html`
<form>
  <input/>
  <input/>
  <button/>
</form>
`


const app = new Hono()

app.get('/', (c) => {
  return c.html(loginPage)
})

app.post ("/login", (c)=>{
  return c.json({OK:""})
});

export default app
