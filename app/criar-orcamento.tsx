// app/criar-orcamento.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
} from "react-native";
import { supabase } from "../utils/supabase";

// Componente de "chip" selecionável (multi-seleção)
function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        selected && { backgroundColor: "#F97316", borderColor: "#F97316" },
      ]}
    >
      <Text style={[styles.chipText, selected && { color: "#111827" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// Botão de opção (Sim/Não/Talvez etc - seleção única)
function OptionButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.optionButton,
        active && { backgroundColor: "#F97316", borderColor: "#F97316" },
      ]}
    >
      <Text
        style={[
          styles.optionButtonText,
          active && { color: "#111827", fontWeight: "700" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * Máscaras manuais
 */

// (xx) xxxxx-xxxx
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11); // até 11 dígitos

  if (digits.length === 0) return "";

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

// dd/mm/aaaa
function formatDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8); // ddmmyyyy

  if (digits.length === 0) return "";

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

// hh:mm
function formatTime(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4); // hhmm

  if (digits.length === 0) return "";

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export default function CriarOrcamentoScreen() {
  // Dados principais
  const [responsavel, setResponsavel] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [horaEvento, setHoraEvento] = useState("");
  const [horaIniciarServico, setHoraIniciarServico] = useState("");
  const [totalPessoas, setTotalPessoas] = useState("");
  const [adultos, setAdultos] = useState("");
  const [criancas5, setCriancas5] = useState("");
  const [criancas10, setCriancas10] = useState("");
  const [localEvento, setLocalEvento] = useState("");
  const [temChurrasqueira, setTemChurrasqueira] = useState(""); // "Sim" | "Não"

  // Tipo de evento
  const [tipoEvento, setTipoEvento] = useState("");
  const [tipoEventoOutro, setTipoEventoOutro] = useState("");

  // Tipo de refeição
  const [tipoRefeicao, setTipoRefeicao] = useState("");

  // Entradas (multi)
  const entradasOpcoes = [
    "Choripan",
    "Queijo coalho",
    "Pao de Alho",
    "Torresmo",
    "Batata Frita",
    "Polenta Frita",
    "Mandioca Frita",
    "Opção 8",
  ];
  const [entradasSelecionadas, setEntradasSelecionadas] = useState<string[]>(
    []
  );

  // Churrasco Tradicional (multi)
  const churrascoTradicionalOpcoes = [
    "Picanha",
    "Contra Filet",
    "Cupim",
    "Costela Assada no Bafo",
    "Alcatra",
    "Fraldinha",
    "Maminha",
    "Linguiça",
    "Coração",
    "Sobrecoxa",
    "Meio da Asa",
    "Coxinha da Asa",
    "Copa Lombo",
    "Lombo",
    "Panceta",
    "Costelinha Temperada",
  ];
  const [churrascoTradicionalSelecionado, setChurrascoTradicionalSelecionado] =
    useState<string[]>([]);
  const [churrascoTradOutro, setChurrascoTradOutro] = useState("");

  // Fogo de Chão (multi)
  const fogoChaoOpcoes = [
    "Costela",
    "Leitão",
    "Carneiro/Cordeiro",
    "Frango",
    "Galeto",
    "Peixe",
  ];
  const [fogoChaoSelecionado, setFogoChaoSelecionado] = useState<string[]>([]);

  // Churrasco Especial (multi)
  const churrascoEspecialOpcoes = [
    "Picanha Angus",
    "Chorizo",
    "Ancho",
    "T Bone",
    "Prime Rib",
    "Short Rib",
    "Shoulder",
    "Assado de Tira",
    "Paleta de Cordeiro",
    "Carret de Cordeiro",
    "Costelinha Barbecue",
    "Salmão Defumado",
  ];
  const [churrascoEspecialSelecionado, setChurrascoEspecialSelecionado] =
    useState<string[]>([]);

  // Acompanhamentos (multi)
  const acompanhamentosOpcoes = [
    "Arroz branco",
    "Arroz carreteiro",
    "Paella caipira",
    "Galinhada",
    "Feijão Gordo",
    "Feijão Tropeiro",
    "Batatonese (Batata, Ovo e especiarias)",
    "Maionese",
    "Vinagrete Comum",
    "Vinagrete de Abacaxi",
    "Vinagrete de Manga",
    "Farofa de Bacon e Calabresa",
    "Farofa de Ovo",
    "Farofa de Maracujá e Rúcula",
    "Farofa de Alho e Cebola",
    "Farofa de Bacon e Abacaxi agridoce",
    "Ratatouille de Legumes",
    "Legumes Grelhados",
    "Mandioca na Manteiga de garrafa",
    "Salada Verde",
    "Salada de Palmito",
    "Salada Tropical(com frutas)",
  ];
  const [acompanhamentosSelecionados, setAcompanhamentosSelecionados] =
    useState<string[]>([]);

  // Sobremesas (multi)
  const sobremesasOpcoes = [
    "Panqueca de Doce de Leite",
    "Abacaxi Caramelizado com Leite Condensado e Leite Condensado",
    "Banana prensada com canela e Açucar",
    "Banana com chocolate",
    "Queijo coalho com doce de Leite e farofa de castanha",
    "Romeu e Julieta",
    "Sorvete",
  ];
  const [sobremesasSelecionadas, setSobremesasSelecionadas] = useState<
    string[]
  >([]);
  const [sobremesaOutro, setSobremesaOutro] = useState("");

  // Serviços adicionais
  const [precisaGarcom, setPrecisaGarcom] = useState(""); // Sim/Não/Talvez
  const [precisaDescartaveis, setPrecisaDescartaveis] = useState("");
  const [precisaPrataria, setPrecisaPrataria] = useState("");

  // Observações
  const [mensagemExtra, setMensagemExtra] = useState("");

  function toggleFromArray(list: string[], value: string) {
    if (list.includes(value)) {
      return list.filter((item) => item !== value);
    }
    return [...list, value];
  }

  function resetForm() {
    setResponsavel("");
    setTelefone("");
    setDataEvento("");
    setHoraEvento("");
    setHoraIniciarServico("");
    setTotalPessoas("");
    setAdultos("");
    setCriancas5("");
    setCriancas10("");
    setLocalEvento("");
    setTemChurrasqueira("");

    setTipoEvento("");
    setTipoEventoOutro("");
    setTipoRefeicao("");

    setEntradasSelecionadas([]);
    setChurrascoTradicionalSelecionado([]);
    setChurrascoTradOutro("");
    setFogoChaoSelecionado([]);
    setChurrascoEspecialSelecionado([]);
    setAcompanhamentosSelecionados([]);
    setSobremesasSelecionadas([]);
    setSobremesaOutro("");

    setPrecisaGarcom("");
    setPrecisaDescartaveis("");
    setPrecisaPrataria("");

    setMensagemExtra("");
  }

  const handleEnviarOrcamento = async () => {
    console.log("▶️ Cliquei no botão ENVIAR");

    if (!responsavel.trim() || !telefone.trim()) {
      Alert.alert(
        "Atenção",
        'Por favor, preencha pelo menos "Nome do responsável" e "Telefone para contato".'
      );
      return;
    }

    const dadosFormulario = {
      responsavel,
      telefone,
      data_evento: dataEvento || null,
      hora_evento: horaEvento || null,
      hora_servir: horaIniciarServico || null,
      total_pessoas: totalPessoas || null,
      adultos: adultos || null,
      criancas5: criancas5 || null,
      criancas10: criancas10 || null,
      local_evento: localEvento || null,
      tem_churrasqueira: temChurrasqueira || null,
      tipo_evento: tipoEvento || null,
      tipo_evento_outro: tipoEventoOutro || null,
      tipo_refeicao: tipoRefeicao || null,
      entradas: entradasSelecionadas.length ? entradasSelecionadas : null,
      churrasco_tradicional: churrascoTradicionalSelecionado.length
        ? churrascoTradicionalSelecionado
        : null,
      churrasco_tradicional_outro: churrascoTradOutro || null,
      fogo_chao: fogoChaoSelecionado.length ? fogoChaoSelecionado : null,
      churrasco_especial: churrascoEspecialSelecionado.length
        ? churrascoEspecialSelecionado
        : null,
      acompanhamentos: acompanhamentosSelecionados.length
        ? acompanhamentosSelecionados
        : null,
      sobremesas: sobremesasSelecionadas.length
        ? sobremesasSelecionadas
        : null,
      sobremesa_outro: sobremesaOutro || null,
      precisa_garcom: precisaGarcom || null,
      precisa_descartaveis: precisaDescartaveis || null,
      precisa_prataria: precisaPrataria || null,
      mensagem_extra: mensagemExtra || null,
      status: "novo",
      criado_em: new Date().toISOString(),
    };

    console.log("📝 Dados do formulário de orçamento:", dadosFormulario);

    try {
      const { data, error } = await supabase
        .from("orcamentos")
        .insert([dadosFormulario])
        .select();

      console.log("✅ Supabase data (orcamentos):", data);
      console.log("⚠️ Supabase error (orcamentos):", error);

      if (error) {
        Alert.alert(
          "Erro ao salvar no Supabase",
          `Mensagem: ${error.message}`
        );
        return;
      }

      if (!data || data.length === 0) {
        Alert.alert(
          "Aviso",
          "Supabase não retornou dados, mas também não informou erro. Verifique a tabela depois."
        );
      } else {
        Alert.alert(
          "Solicitação enviada",
          "Suas informações foram registradas. A PuoBBQ entrará em contato em breve com o orçamento do seu evento. 🍖🔥"
        );
      }

      resetForm();
    } catch (err: any) {
      console.log("💥 ERRO DESCONHECIDO ao enviar orçamento:", err);
      Alert.alert(
        "Erro inesperado",
        `Detalhes: ${err?.message || "sem detalhes"}`
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#020617" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Cabeçalho para o CLIENTE */}
        <View style={styles.header}>
          <Text style={styles.title}>Formulário de evento</Text>
          <Text style={styles.subtitle}>
            Preencha os dados abaixo para que a PuoBBQ possa montar o melhor
            orçamento para o seu churrasco.
          </Text>
          <Text style={styles.subtitleSmall}>
            Você receberá o retorno através do telefone/WhatsApp informado.
          </Text>
        </View>

        {/* 🔹 DADOS DO EVENTO – SUBCARDS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Dados do evento</Text>

          {/* Bloco 1: Responsável & Contato */}
          <View style={styles.subCard}>
            <Text style={styles.subCardTitle}>Responsável e contato</Text>
            <Text style={styles.label}>Nome do responsável pelo evento</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: João da Silva"
              placeholderTextColor="#6B7280"
              value={responsavel}
              onChangeText={setResponsavel}
            />

            <Text style={styles.label}>Telefone para contato (WhatsApp)</Text>
            {Platform.OS === "web" ? (
              <input
                style={styles.inputWeb as any}
                placeholder="Ex: (11) 99999-9999"
                maxLength={15}
                value={telefone}
                onChange={(e: any) =>
                  setTelefone(formatPhone(e.target.value))
                }
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Ex: (11) 99999-9999"
                placeholderTextColor="#6B7280"
                keyboardType="phone-pad"
                value={telefone}
                onChangeText={(text) => setTelefone(formatPhone(text))}
                maxLength={15}
              />
            )}
          </View>

          {/* Bloco 2: Datas e horários */}
          <View style={styles.subCard}>
            <Text style={styles.subCardTitle}>Datas e horários</Text>

            <View style={styles.inlineRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Data do evento</Text>
                {Platform.OS === "web" ? (
                  <input
                    style={styles.inputWeb as any}
                    placeholder="Ex: 20/12/2025"
                    maxLength={10}
                    value={dataEvento}
                    onChange={(e: any) =>
                      setDataEvento(formatDate(e.target.value))
                    }
                  />
                ) : (
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 20/12/2025"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                    value={dataEvento}
                    onChangeText={(text) => setDataEvento(formatDate(text))}
                    maxLength={10}
                  />
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>Horário do evento</Text>
                {Platform.OS === "web" ? (
                  <input
                    style={styles.inputWeb as any}
                    placeholder="Ex: 19:00"
                    maxLength={5}
                    value={horaEvento}
                    onChange={(e: any) =>
                      setHoraEvento(formatTime(e.target.value))
                    }
                  />
                ) : (
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 19:00"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                    value={horaEvento}
                    onChangeText={(text) => setHoraEvento(formatTime(text))}
                    maxLength={5}
                  />
                )}
              </View>
            </View>

            <Text style={styles.label}>
              Horário para iniciar o serviço de "Servir a comida"
            </Text>
            {Platform.OS === "web" ? (
              <input
                style={styles.inputWeb as any}
                placeholder="Ex: 20:00"
                maxLength={5}
                value={horaIniciarServico}
                onChange={(e: any) =>
                  setHoraIniciarServico(formatTime(e.target.value))
                }
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Ex: 20:00"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                value={horaIniciarServico}
                onChangeText={(text) =>
                  setHoraIniciarServico(formatTime(text))
                }
                maxLength={5}
              />
            )}
          </View>

          {/* Bloco 3: Quantidade de pessoas */}
          <View style={styles.subCard}>
            <Text style={styles.subCardTitle}>Quantidade de pessoas</Text>

            <View style={styles.inlineRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Total de pessoas</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 50"
                  placeholderTextColor="#6B7280"
                  keyboardType="numeric"
                  value={totalPessoas}
                  onChangeText={setTotalPessoas}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>Adultos</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 30"
                  placeholderTextColor="#6B7280"
                  keyboardType="numeric"
                  value={adultos}
                  onChangeText={setAdultos}
                />
              </View>
            </View>

            <View style={styles.inlineRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Crianças até 5 anos</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 10"
                  placeholderTextColor="#6B7280"
                  keyboardType="numeric"
                  value={criancas5}
                  onChangeText={setCriancas5}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>Crianças até 10 anos</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 10"
                  placeholderTextColor="#6B7280"
                  keyboardType="numeric"
                  value={criancas10}
                  onChangeText={setCriancas10}
                />
              </View>
            </View>
          </View>

          {/* Bloco 4: Local do evento */}
          <View style={styles.subCard}>
            <Text style={styles.subCardTitle}>Local do evento</Text>

            <Text style={styles.label}>Endereço / descrição do local</Text>
            <TextInput
              style={styles.input}
              placeholder="Endereço, bairro, cidade"
              placeholderTextColor="#6B7280"
              value={localEvento}
              onChangeText={setLocalEvento}
            />

            <Text style={styles.label}>O local tem Churrasqueira?</Text>
            <View style={styles.optionsRow}>
              <OptionButton
                label="Sim"
                active={temChurrasqueira === "Sim"}
                onPress={() => setTemChurrasqueira("Sim")}
              />
              <OptionButton
                label="Não"
                active={temChurrasqueira === "Não"}
                onPress={() => setTemChurrasqueira("Não")}
              />
            </View>
          </View>
        </View>

        {/* Tipo de evento */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Tipo de evento</Text>

          {[
            "Aniversario Criança",
            "Aniversario Adulto",
            "Confraternização de Empresa",
            "Confraternização de Amigos",
            "Casamento",
            "Jantar/Almoço",
          ].map((op) => (
            <TouchableOpacity
              key={op}
              style={[
                styles.radioRow,
                tipoEvento === op && {
                  borderColor: "#F97316",
                  backgroundColor: "#0B1120",
                },
              ]}
              onPress={() => setTipoEvento(op)}
            >
              <View
                style={[
                  styles.radioOuter,
                  tipoEvento === op && { borderColor: "#F97316" },
                ]}
              >
                {tipoEvento === op && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>{op}</Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.label, { marginTop: 8 }]}>Outro</Text>
          <TextInput
            style={styles.input}
            placeholder="Descreva o tipo de evento"
            placeholderTextColor="#6B7280"
            value={tipoEventoOutro}
            onChangeText={setTipoEventoOutro}
          />
        </View>

        {/* Tipo de refeição */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Tipo de refeição</Text>

          {[
            "Churrasco tradicional",
            "Churrasco Fogo de Chão",
            "Pratos a La Carte",
          ].map((op) => (
            <TouchableOpacity
              key={op}
              style={[
                styles.radioRow,
                tipoRefeicao === op && {
                  borderColor: "#F97316",
                  backgroundColor: "#0B1120",
                },
              ]}
              onPress={() => setTipoRefeicao(op)}
            >
              <View
                style={[
                  styles.radioOuter,
                  tipoRefeicao === op && { borderColor: "#F97316" },
                ]}
              >
                {tipoRefeicao === op && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>{op}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Entradas */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Entradas</Text>
          <View style={styles.chipsContainer}>
            {entradasOpcoes.map((op) => (
              <Chip
                key={op}
                label={op}
                selected={entradasSelecionadas.includes(op)}
                onPress={() =>
                  setEntradasSelecionadas((prev) => toggleFromArray(prev, op))
                }
              />
            ))}
          </View>
        </View>

        {/* Churrasco Tradicional */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Churrasco Tradicional</Text>
          <View style={styles.chipsContainer}>
            {churrascoTradicionalOpcoes.map((op) => (
              <Chip
                key={op}
                label={op}
                selected={churrascoTradicionalSelecionado.includes(op)}
                onPress={() =>
                  setChurrascoTradicionalSelecionado((prev) =>
                    toggleFromArray(prev, op)
                  )
                }
              />
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 8 }]}>Outro</Text>
          <TextInput
            style={styles.input}
            placeholder="Outro corte/tradicional"
            placeholderTextColor="#6B7280"
            value={churrascoTradOutro}
            onChangeText={setChurrascoTradOutro}
          />
        </View>

        {/* Fogo de Chão */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Fogo de Chão</Text>
          <View style={styles.chipsContainer}>
            {fogoChaoOpcoes.map((op) => (
              <Chip
                key={op}
                label={op}
                selected={fogoChaoSelecionado.includes(op)}
                onPress={() =>
                  setFogoChaoSelecionado((prev) => toggleFromArray(prev, op))
                }
              />
            ))}
          </View>
        </View>

        {/* Churrasco Especial */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Churrasco Especial</Text>
          <View style={styles.chipsContainer}>
            {churrascoEspecialOpcoes.map((op) => (
              <Chip
                key={op}
                label={op}
                selected={churrascoEspecialSelecionado.includes(op)}
                onPress={() =>
                  setChurrascoEspecialSelecionado((prev) =>
                    toggleFromArray(prev, op)
                  )
                }
              />
            ))}
          </View>
        </View>

        {/* Acompanhamentos */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Acompanhamentos</Text>
          <View style={styles.chipsContainer}>
            {acompanhamentosOpcoes.map((op) => (
              <Chip
                key={op}
                label={op}
                selected={acompanhamentosSelecionados.includes(op)}
                onPress={() =>
                  setAcompanhamentosSelecionados((prev) =>
                    toggleFromArray(prev, op)
                  )
                }
              />
            ))}
          </View>
        </View>

        {/* Sobremesas */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Sobremesas</Text>
          <View style={styles.chipsContainer}>
            {sobremesasOpcoes.map((op) => (
              <Chip
                key={op}
                label={op}
                selected={sobremesasSelecionadas.includes(op)}
                onPress={() =>
                  setSobremesasSelecionadas((prev) =>
                    toggleFromArray(prev, op)
                  )
                }
              />
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 8 }]}>Outro</Text>
          <TextInput
            style={styles.input}
            placeholder="Outra sobremesa"
            placeholderTextColor="#6B7280"
            value={sobremesaOutro}
            onChangeText={setSobremesaOutro}
          />
        </View>

        {/* Serviços adicionais */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Serviços adicionais</Text>

          <Text style={styles.label}>Precisa de serviço de garçom?</Text>
          <View style={styles.optionsRow}>
            {["Sim", "Não", "Talvez"].map((op) => (
              <OptionButton
                key={op}
                label={op}
                active={precisaGarcom === op}
                onPress={() => setPrecisaGarcom(op)}
              />
            ))}
          </View>

          <Text style={styles.label}>Precisa de descartáveis?</Text>
          <View style={styles.optionsRow}>
            {["Sim", "Não", "Talvez"].map((op) => (
              <OptionButton
                key={op}
                label={op}
                active={precisaDescartaveis === op}
                onPress={() => setPrecisaDescartaveis(op)}
              />
            ))}
          </View>

          <Text style={styles.label}>
            Gostaria de Prataria (Pratos/copos de vidro; talheres de aço)?
          </Text>
          <View style={styles.optionsRow}>
            {["Sim", "Não", "Talvez"].map((op) => (
              <OptionButton
                key={op}
                label={op}
                active={precisaPrataria === op}
                onPress={() => setPrecisaPrataria(op)}
              />
            ))}
          </View>
        </View>

        {/* Mensagem extra */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Informações adicionais</Text>
          <Text style={styles.label}>
            Se faltou alguma informação importante para seu evento, deixe aqui
            sua mensagem.
          </Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            placeholder="Ex: tema da festa, restrições alimentares, observações específicas..."
            placeholderTextColor="#6B7280"
            multiline
            value={mensagemExtra}
            onChangeText={setMensagemExtra}
          />
        </View>

        {/* Botões finais */}
        <TouchableOpacity style={styles.mainButton} onPress={handleEnviarOrcamento}>
          <Text style={styles.mainButtonText}>
            Enviar solicitação de orçamento
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={resetForm}>
          <Text style={styles.secondaryButtonText}>Limpar formulário</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    color: "#F97316",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },
  subtitleSmall: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 8,
  },
  subCard: {
    backgroundColor: "#020617",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#111827",
    marginTop: 8,
  },
  subCardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#F9FAFB",
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    color: "#D1D5DB",
    marginBottom: 4,
    marginTop: 4,
  },
  input: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#F9FAFB",
    fontSize: 14,
    marginBottom: 6,
  },
  inputWeb: {
    width: "100%",
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: "#F9FAFB",
    fontSize: 14,
    marginBottom: 6,
    outline: "none",
  },
  inlineRow: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 4,
  },
  optionsRow: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 8,
    flexWrap: "wrap",
    gap: 6,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4B5563",
    marginRight: 6,
    marginTop: 4,
  },
  optionButtonText: {
    fontSize: 13,
    color: "#E5E7EB",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4B5563",
    marginBottom: 4,
  },
  chipText: {
    fontSize: 12,
    color: "#E5E7EB",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#6B7280",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: "#F97316",
  },
  radioLabel: {
    fontSize: 13,
    color: "#E5E7EB",
  },
  mainButton: {
    backgroundColor: "#F97316",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  mainButtonText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  secondaryButton: {
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: "#9CA3AF",
    fontSize: 13,
  },
});
