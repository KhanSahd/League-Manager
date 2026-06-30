import { View, Text } from 'react-native'
import React from 'react'
import { theme } from '../ui/theme'
import { Input } from '../ui/Input'

export default function Findleagues() {
  return (
      <View style={{ flex: 1, flexDirection: "column", gap: 20, backgroundColor: theme.colors.bg }}>
          {/* Filters */}
          <View style={{
              marginTop: 20,
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