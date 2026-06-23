import { View, Text } from 'react-native'
import React from 'react'
import { theme } from '../src/ui/theme'
import { Input } from '../src/ui/Input'

export default function findleagues() {
  return (
      <View style={{ flexDirection: "column", gap: 20 }}>
          {/* Filters */}
          <View style={{
              flexDirection: "row",
              justifyContent: 'space-evenly'
          }}>
              <Text style={{color: theme.colors.text}}>Test1</Text>
              <Text style={{color: theme.colors.text}}>Test2</Text>
              <Text style={{color: theme.colors.text}}>Test3</Text>
              <Text style={{color: theme.colors.text}}>Test4</Text>
              <Text style={{color: theme.colors.text}}>Test5</Text>
          </View>

          {/* Search Bar */}
          <Input />
    </View>
  )
}