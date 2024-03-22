import * as zod from 'zod'
import { EditorComponent } from './types'
import { EditorComponentBuilder } from './utils'

// Define the schemas for different nodes that the agent should be able to generate
const EditorNodeSchemas : EditorComponent[] = [
  // DEFAULT NODES
  new EditorComponentBuilder("heading1")
    .setDesc("Used to represent a top level heading in the document.")
    .setValueSchema(zod.string())
    .addExample("This is a top level header")
    .build(),
  new EditorComponentBuilder("heading2")
    .setDesc("Used to represent a sub heading in the document.")
    .setValueSchema(zod.string())
    .addExample("This is a secondary header")
    .build(),
  new EditorComponentBuilder("heading3")
    .setDesc("Used to represent a sub sub heading in the document.")
    .setValueSchema(zod.string())
    .addExample("This is a tertiary header")
    .build(),
  new EditorComponentBuilder("paragraph")
    .setDesc("Used to represent a paragraph in the document.")
    .setValueSchema(zod.string())
    .addExample("This is a paragraph")
    .build(),
  // CUSTOM NODES
  new EditorComponentBuilder("bullet_list")
    .setDesc("Used to represent a bullet list in the document.")
    .setValueSchema(zod.array(zod.string()))
    .addExample([ "This is a bullet list item", "This is another bullet list item"])
    .addExample(["Example 1", "Example 2", "Example 3"])
    .addExampleWithDescription("Example grocery list", ["Egg", "Milk", "Bread"])
    .build(),
]

export default EditorNodeSchemas