// app/index.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  const handleNovoOrcamento = () => {
    router.push("/criar-orcamento");
  };

  const handleOrcamentosAbertos = () => {
    Alert.alert(
      "Orçamentos em aberto",
      "Aqui você vai ver todos os orçamentos que ainda não foram fechados."
    );
  };

  const handleProximosEventos = () => {
    Alert.alert(
      "Próximos eventos",
      "Aqui você vai acompanhar os eventos já fechados e que ainda vão acontecer."
    );
  };

  const handleEventosRealizados = () => {
    Alert.alert(
      "Eventos realizados",
      "Aqui você verá o histórico de eventos já realizados."
    );
  };

  const handleConfig = () => {
    Alert.alert(
      "Configurações",
      "Aqui você poderá ajustar informações da sua empresa, cardápios padrão, etc."
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>PuoBBQ</Text>
            <Text style={styles.appSubtitle}>
              Painel da sua empresa de churrasco 🍖
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Versão 1.0</Text>
          </View>
        </View>

        {/* Resumo / Cards de status (simulados por enquanto) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo de hoje</Text>
          <View style={styles.cardsRow}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Orçamentos em aberto</Text>
              <Text style={styles.cardValue}>3</Text>
              <Text style={styles.cardHint}>para responder</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Próximos eventos</Text>
              <Text style={styles.cardValue}>2</Text>
              <Text style={styles.cardHint}>nos próximos dias</Text>
            </View>
          </View>

          <View style={styles.cardsRow}>
            <View style={styles.cardSmall}>
              <Text style={styles.cardLabel}>Eventos no mês</Text>
              <Text style={styles.cardValue}>8</Text>
            </View>

            <View style={styles.cardSmall}>
              <Text style={styles.cardLabel}>Taxa de fechamento</Text>
              <Text style={styles.cardValue}>65%</Text>
            </View>
          </View>
        </View>

        {/* Ações rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações rápidas</Text>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={handleNovoOrcamento}
          >
            <Text style={styles.actionButtonTitle}>Novo orçamento</Text>
            <Text style={styles.actionButtonSubtitle}>
              Gerar um orçamento para um cliente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleOrcamentosAbertos}
          >
            <Text style={styles.actionButtonTitle}>Orçamentos em aberto</Text>
            <Text style={styles.actionButtonSubtitle}>
              Ver orçamentos ainda não fechados
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleProximosEventos}
          >
            <Text style={styles.actionButtonTitle}>Próximos eventos</Text>
            <Text style={styles.actionButtonSubtitle}>
              Acompanhar os eventos já fechados
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEventosRealizados}
          >
            <Text style={styles.actionButtonTitle}>Eventos realizados</Text>
            <Text style={styles.actionButtonSubtitle}>
              Histórico dos eventos que já aconteceram
            </Text>
          </TouchableOpacity>
        </View>

        {/* Próximo evento (simulado) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximo evento</Text>
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>Aniversário do João</Text>
            <Text style={styles.eventInfo}>Data: 14/12/2025 - 20h</Text>
            <Text style={styles.eventInfo}>Convidados: 40 pessoas</Text>
            <Text style={styles.eventInfo}>Local: Bairro Centro</Text>

            <View style={styles.eventFooter}>
              <Text style={styles.eventStatus}>Status: Fechado ✅</Text>
              <Text style={styles.eventHint}>
                Em breve, aqui você poderá ver todos os detalhes do evento.
              </Text>
            </View>
          </View>
        </View>

        {/* Config */}
        <TouchableOpacity style={styles.configButton} onPress={handleConfig}>
          <Text style={styles.configText}>Configurações da empresa</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#020617",
  },
  container: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F97316",
  },
  appSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  badge: {
    backgroundColor: "#111827",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#374151",
  },
  badgeText: {
    color: "#E5E7EB",
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 12,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  cardSmall: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  cardLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F97316",
  },
  cardHint: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  actionButton: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1F2937",
    marginBottom: 10,
  },
  actionButtonPrimary: {
    backgroundColor: "#F97316",
    borderColor: "#F97316",
  },
  actionButtonTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F9FAFB",
  },
  actionButtonSubtitle: {
    fontSize: 12,
    color: "#D1D5DB",
    marginTop: 4,
  },
  eventCard: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F9FAFB",
    marginBottom: 8,
  },
  eventInfo: {
    fontSize: 13,
    color: "#D1D5DB",
    marginBottom: 2,
  },
  eventFooter: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#111827",
    paddingTop: 8,
  },
  eventStatus: {
    fontSize: 13,
    color: "#22C55E",
    marginBottom: 4,
  },
  eventHint: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  configButton: {
    marginTop: 8,
    alignItems: "center",
  },
  configText: {
    fontSize: 13,
    color: "#9CA3AF",
    textDecorationLine: "underline",
  },
});
