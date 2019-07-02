import $$ from '../TestHelpers'

describe('object', () => {

  test('from JS object with decorators', () => {
    const obj = {
      ele: "simple element",
      person: {
        name: "John",
        '@age': 35,
        '?': 'pi mypi',
        '!': 'Good guy',
        '$': 'well formed!',
        '&': '<>&',
        address: {
          '?': 'pi',
          city: "Istanbul",
          street: "End of long and winding road"
        },
        contact: {
          phone: [ "555-1234", "555-1235" ]
        },
        id: () => 42,
        details: {
          '#': 'classified'
        }
      }
    }

    const doc = $$.xml().create('root').ele(obj).doc()

    expect($$.printTree(doc)).toBe($$.t`
      root
        ele
          # simple element
        person age="35"
          name
            # John
          ? pi mypi
          ! Good guy
          $ well formed!
          # <>&
          address
            ? pi
            city
              # Istanbul
            street
              # End of long and winding road
          contact
            phone
              # 555-1234
            phone
              # 555-1235
          id
            # 42
          details
            # classified
      `)
  })

  test('from map with decorators', () => {
    const obj = new Map<string, any>()
    obj.set("ele", "simple element")
    const person = new Map<string, any>()
    obj.set("person", person)
    person.set("name", "John")
    person.set("@age", 35)
    person.set("?", "pi mypi")
    person.set("!", "Good guy")
    person.set("$", "well formed!")
    const address = new Map<string, any>()
    person.set("address", address)
    address.set("city", "Istanbul")
    address.set("street", "End of long and winding road")
    const contact = new Map<string, any>()
    person.set("contact", contact)
    const numbers = new Array<string>()
    contact.set("phone", numbers)
    numbers.push("555-1234")
    numbers.push("555-1235")
    person.set("id", () => 42)
    const details = new Map<string, any>()
    person.set("details", details)
    details.set("#", "classified")

    const doc = $$.xml().create('root').ele(obj).doc()

    expect($$.printTree(doc)).toBe($$.t`
      root
        ele
          # simple element
        person age="35"
          name
            # John
          ? pi mypi
          ! Good guy
          $ well formed!
          address
            city
              # Istanbul
            street
              # End of long and winding road
          contact
            phone
              # 555-1234
            phone
              # 555-1235
          id
            # 42
          details
            # classified
      `)
  })

  test('from function', () => {
    const doc = $$.xml().create('root').ele(() => {
      const arr = []
      const i = 0
      for (let i = 1; i < 5; i++) {
        arr.push({ "#": "ele" + i.toString() })
      }
      return { node: arr }
    }).doc()

    expect($$.printTree(doc)).toBe($$.t`
      root
        node
          # ele1
        node
          # ele2
        node
          # ele3
        node
          # ele4
    `)
  })

  test('empty nodes', () => {
    const obj = { 
      root: {
        node1: [],
        node2: {},
        node3: null
      }
    }
    const doc = $$.xml().create(obj).doc()

    expect($$.printTree(doc)).toBe($$.t`
      root
        node2
    `)
  })

  test('mixed content', () => {
    const obj = { 
      root: {
        node1: "val1",
        "#": {
          "#1": "some text",
          node: "and a node",
          "#2": "more text"
        },
        node3: "val3"
      }
    }
    const doc = $$.xml().create(obj).doc()

    expect($$.printTree(doc)).toBe($$.t`
      root
        node1
          # val1
        # some text
        node
          # and a node
        # more text
        node3
          # val3
    `)
  })

  test('namespace', () => {
    const obj = { 
      root: {
        "@xmlns": "myns",
        node: "val",
      }
    }
    const doc = $$.xml().create(obj).doc()

    expect($$.printTree(doc)).toBe($$.t`
      root (ns:myns)
        node (ns:myns)
          # val
    `)
  })

  test('error if no nodes created', () => {
    expect(() => $$.xml().create({ })).toThrow()
  })

})
