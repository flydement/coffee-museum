import fs from 'node:fs'
import { registerHooks } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      (specifier.startsWith('./') || specifier.startsWith('../')) &&
      !/\.[a-z0-9]+$/i.test(specifier) &&
      context.parentURL?.startsWith('file:')
    ) {
      const candidateUrl = new URL(`${specifier}.ts`, context.parentURL)
      if (fs.existsSync(fileURLToPath(candidateUrl))) {
        return { url: pathToFileURL(fileURLToPath(candidateUrl)).href, shortCircuit: true }
      }
    }
    return nextResolve(specifier, context)
  },
})
