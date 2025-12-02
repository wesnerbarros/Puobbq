// app/test-supabase.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { supabase } from "../utils/supabase";

export default function TestSupabaseScreen() {
  const handleTest = async () => {
    try {
      const { data, error } = await supabase
        .from("orcamentos")
        .insert([
          {
            responsavel: "Teste Supabase",
            telefone: "(00) 00000-0000",
            status: "novo",
          },
        ])
        .select();

      if (error) {
        console.log("ERRO SUPABASE:", error);
        Alert.alert("Erro ao inserir", error.message);
        return;
      }

      console.log("INSERT OK:", data);
      Alert.alert("Sucesso", "Linha criada com id: " + (data?.[0]?.id ?? "-"));
    } catch (err: any) {
      console.log("ERRO DESCONHECIDO:", err);
      Alert.alert(
        "Erro inesperado",
        err?.message ? String(err.message) : "sem detalhes"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teste de conexão com Supabase</Text>

      <TouchableOpacity style={styles.button} onPress={handleTest}>
        <Text style={styles.buttonText}>Inserir orçamento de teste</Text>
      </TouchableOpacity>

      <Text style={styles.tip}>
        Depois de clicar, veja em Database → Tables → orcamentos → Data se
        apareceu uma nova linha.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 18,
    color: "#F97316",
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#F97316",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    marginBottom: 12,
  },
  buttonText: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 14,
  },
  tip: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 8,
  },
});
