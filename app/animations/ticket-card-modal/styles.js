import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  card: {
    width: width * 0.9,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 10,
  },

  /* HANDLE */
  handleContainer: {
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "#1E88E5",
  },

  handle: {
    width: 50,
    height: 5,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
  },

  /* HEADER */
  header: {
    backgroundColor: "#1E88E5",
    padding: 20,
  },

  appName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  subtitle: {
    color: "#fff",
    textAlign: "center",
    marginVertical: 15,
    fontSize: 16,
  },

  ticketBox: {
    backgroundColor: "#ffffffaa",
    borderRadius: 20,
    paddingVertical: 25,
    alignItems: "center",
    marginBottom: 20,
  },

  ticketNumber: {
    fontSize: 36,
    fontWeight: "700",
    color: "#222",
  },

  stats: {
    flexDirection: "row",
    alignItems: "center",
  },

  statBlock: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  statLabel: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },

  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#ffffff88",
  },

  /* BODY */
  body: {
    backgroundColor: "#f2f2f2",
    padding: 20,
  },

  infoRow: {
    marginBottom: 15,
  },

  label: {
    color: "#666",
    fontSize: 13,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },

  /* QR */
  qrContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },

  qr: {
    width: 120,
    height: 120,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },

  backButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
  },

  printButton: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#1E88E5",
    alignItems: "center",
  },

  backText: {
    fontWeight: "600",
    color: "#333",
  },

  printText: {
    fontWeight: "600",
    color: "#fff",
  },
});
